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

  // Streaming endpoint for cached Google Drive video
  app.get("/api/video", async (req, res) => {
    const videoPath = path.resolve("./hero_video.mp4");
    if (fs.existsSync(videoPath)) {
      return res.sendFile(videoPath);
    }

    // Try to download on-demand if not cached yet
    const success = await downloadGoogleDriveVideo("18KXLgiBVXlwh1LSOvgAadRdbQwyM4moK", videoPath);
    if (success && fs.existsSync(videoPath)) {
      return res.sendFile(videoPath);
    }

    // Direct fallback redirect if caching completely fails
    res.redirect("https://docs.google.com/uc?export=download&id=18KXLgiBVXlwh1LSOvgAadRdbQwyM4moK");
  });

  // Pre-download the video in the background on startup so it is immediately cached for clients
  const cachedVideoPath = path.resolve("./hero_video.mp4");
  downloadGoogleDriveVideo("18KXLgiBVXlwh1LSOvgAadRdbQwyM4moK", cachedVideoPath).catch(err => {
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
