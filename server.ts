import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Helper to download Google Drive video to a local cache file for high-performance range-request streaming
async function downloadGoogleDriveVideo(fileId: string, outputPath: string): Promise<boolean> {
  try {
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      if (stats.size > 1024 * 1024) { // Verify it's not a tiny corrupted file
        console.log("Video already cached at:", outputPath, `(${Math.round(stats.size / (1024 * 1024))}MB)`);
        return true;
      }
      fs.unlinkSync(outputPath); // Delete corrupted file
    }

    console.log(`Starting background download of Google Drive video ${fileId}...`);
    const baseUrl = "https://docs.google.com/uc?export=download";
    let url = `${baseUrl}&id=${fileId}`;

    // Step 1: Initial request
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Drive initial request failed with status: ${response.status}`);
    }

    // Check if the response is actually an HTML page (Google Drive virus scan confirm screen)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      const htmlText = await response.text();
      const confirmMatch = htmlText.match(/confirm=([0-9A-Za-z_]+)/);
      if (confirmMatch) {
        const confirmToken = confirmMatch[1];
        console.log(`Found Google Drive virus scan confirmation token: ${confirmToken}`);
        url = `${baseUrl}&confirm=${confirmToken}&id=${fileId}`;
        response = await fetch(url);
      } else {
        throw new Error("Received HTML response but could not parse confirmation token.");
      }
    }

    if (!response.ok) {
      throw new Error(`Google Drive video stream fetch failed with status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength < 1000) {
      throw new Error(`Downloaded file is too small (${arrayBuffer.byteLength} bytes), likely an error page.`);
    }

    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log(`Google Drive video successfully downloaded and cached to ${outputPath} (${Math.round(arrayBuffer.byteLength / (1024 * 1024))}MB)`);
    return true;
  } catch (error) {
    console.error("Error downloading Google Drive video:", error);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate environment variables
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.error("Missing Gmail credentials in environment variables.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Create Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Email options
    const mailOptions = {
      from: `"${name}" <${gmailUser}>`, // Must be from the authenticated user
      replyTo: email,
      to: gmailUser, // Send the message to yourself
      subject: `[Website Inquiry] ${subject || "General Inquiry"}`,
      text: `You have a new message from your website contact form:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Streaming endpoint for cached Google Drive video supporting HTTP Range Requests
  app.get("/api/video", async (req, res) => {
    const videoPath = path.resolve("./hero_video_v2.mp4");
    
    // If the video is not downloaded yet, download it
    if (!fs.existsSync(videoPath)) {
      console.log("Cached video not found, downloading on-demand...");
      const success = await downloadGoogleDriveVideo("1PZBzojJq4ILsta40Te-C9uxGKTDH16rL", videoPath);
      if (!success || !fs.existsSync(videoPath)) {
        console.error("Failed to download video on-demand, falling back to redirect.");
        return res.redirect("https://docs.google.com/uc?export=download&id=1PZBzojJq4ILsta40Te-C9uxGKTDH16rL");
      }
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send("Requested range not satisfiable\n" + start + " >= " + fileSize);
        return;
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes"
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  });

  // Pre-download the video in the background on startup so it is immediately cached for clients
  const cachedVideoPath = path.resolve("./hero_video_v2.mp4");
  downloadGoogleDriveVideo("1PZBzojJq4ILsta40Te-C9uxGKTDH16rL", cachedVideoPath).catch(err => {
    console.error("Failed to pre-download background video:", err);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
