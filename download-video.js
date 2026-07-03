import fs from "fs";
import path from "path";

async function downloadVideo() {
  const fileId = "1PZBzojJq4ILsta40Te-C9uxGKTDH16rL";
  const publicDir = path.resolve("./public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const outputPath = path.join(publicDir, "hero_video.mp4");

  // Check if it already exists and is valid
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    if (stats.size > 1024 * 1024) {
      console.log(`Video already downloaded at: ${outputPath} (${Math.round(stats.size / (1024 * 1024))}MB)`);
      return;
    }
    fs.unlinkSync(outputPath);
  }

  console.log(`Downloading Google Drive video ${fileId} during build...`);
  const baseUrl = "https://docs.google.com/uc?export=download";
  let url = `${baseUrl}&id=${fileId}`;

  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Drive initial request failed with status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      const htmlText = await response.text();
      const confirmMatch = htmlText.match(/confirm=([0-9A-Za-z_]+)/);
      if (confirmMatch) {
        const confirmToken = confirmMatch[1];
        url = `${baseUrl}&confirm=${confirmToken}&id=${fileId}`;
        response = await fetch(url);
      } else {
        throw new Error("Could not parse confirmation token from HTML response.");
      }
    }

    if (!response.ok) {
      throw new Error(`Google Drive fetch failed with status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength < 1000) {
      throw new Error("Downloaded file is too small, likely an error page.");
    }

    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log(`Video successfully downloaded to public folder at ${outputPath} (${Math.round(arrayBuffer.byteLength / (1024 * 1024))}MB)`);
  } catch (error) {
    console.error("Failed to download background video during build, Vercel will fall back to other sources:", error);
  }
}

downloadVideo();
