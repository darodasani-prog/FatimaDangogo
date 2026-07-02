import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { Readable } from "stream";

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
    console.log("=== New Contact Submission ===");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log("==============================");
    res.json({ success: true });
  });

  // Streaming endpoint for Google Drive video supporting HTTP Range Requests on-the-fly
  app.get("/api/video", async (req, res) => {
    try {
      const fileId = "1PZBzojJq4ILsta40Te-C9uxGKTDH16rL";
      const baseUrl = "https://docs.google.com/uc?export=download";
      let url = `${baseUrl}&id=${fileId}`;

      // Forward client's range header if it exists
      const headers: Record<string, string> = {};
      if (req.headers.range) {
        headers["Range"] = req.headers.range;
      }

      console.log(`Proxying range request to Google Drive for file ${fileId}, Range: ${req.headers.range || "None"}`);

      let response = await fetch(url, { headers });

      // Handle Google Drive confirmation page if it is returned (e.g., virus warning for large files)
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        const htmlText = await response.text();
        const confirmMatch = htmlText.match(/confirm=([0-9A-Za-z_]+)/);
        if (confirmMatch) {
          const confirmToken = confirmMatch[1];
          url = `${baseUrl}&confirm=${confirmToken}&id=${fileId}`;
          response = await fetch(url, { headers });
        } else {
          throw new Error("Could not parse Google Drive confirmation token from HTML response.");
        }
      }

      if (!response.ok && response.status !== 206) {
        console.error(`Google Drive proxy request failed with status: ${response.status}`);
        return res.status(response.status).send(`Failed to stream from Google Drive: status ${response.status}`);
      }

      // Set headers from Google Drive back to client
      res.status(response.status);
      const headersToForward = [
        "content-type",
        "content-length",
        "content-range",
        "accept-ranges",
        "cache-control"
      ];
      for (const headerName of headersToForward) {
        const headerValue = response.headers.get(headerName);
        if (headerValue) {
          res.setHeader(headerName, headerValue);
        }
      }

      // If no content-type was returned, default to video/mp4
      if (!res.getHeader("content-type")) {
        res.setHeader("content-type", "video/mp4");
      }

      if (response.body) {
        Readable.fromWeb(response.body as any).pipe(res);
      } else {
        res.end();
      }
    } catch (error) {
      console.error("Error in /api/video proxy streaming:", error);
      res.status(500).send("Internal server error streaming video");
    }
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
