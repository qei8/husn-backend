const fs = require("fs");
const path = require("path");

const API_URL = "https://qrygmjfmgc.eu-central-1.awsapprunner.com/api/drone/frame";
const IMAGE_PATH = path.join(__dirname, "test-fire.jpg");

async function sendFrame() {
  try {
    if (!fs.existsSync(IMAGE_PATH)) {
      throw new Error(`Image not found: ${IMAGE_PATH}`);
    }

    const fileBuffer = fs.readFileSync(IMAGE_PATH);

    const form = new FormData();
    const blob = new Blob([fileBuffer], { type: "image/jpeg" });

    form.append("file", blob, "test-fire.jpg");
    form.append("lat", "21.5");
    form.append("lng", "39.2");
    form.append("uavId", "UAV-01");

    const response = await fetch(API_URL, {
      method: "POST",
      body: form,
    });

    const text = await response.text();

    console.log("Status:", response.status);

    try {
      const data = JSON.parse(text);
      console.log("Drone sent frame result:");
      console.log(JSON.stringify(data, null, 2));
    } catch {
      console.log("Raw response:");
      console.log(text);
    }
  } catch (err) {
    console.error("Drone error:", err.message);
  }
}

console.log("Drone simulator started...");

setInterval(sendFrame, 5000);