import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import puppeteer from "puppeteer";

const ciStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.mimetype.split("/")[0];
    if (type === "image") {
      cb(null, path.join(__dirname, "assets", "ci", "images"));
    }
    if (type === "video") {
      cb(null, path.join(__dirname, "assets", "ci", "videos"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadCi = multer({ storage: ciStorage });

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ci", uploadCi.single("file"), (req, res) => {
  res.send();
});

app.delete("/ci", (req, res) => {
  const { type, name } = req.body;
  fs.unlinkSync(path.join(__dirname, "assets", "ci", type, name));
  res.status(201).send();
});

app.get("/listFilesCi", (req, res) => {
  res.json({
    images: fs.readdirSync(path.join(__dirname, "assets", "ci", "images")),
    videos: fs.readdirSync(path.join(__dirname, "assets", "ci", "videos")),
  });
});

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    ignoreDefaultArgs: ["--enable-automation"],
    args: [
      "--kiosk",
      "--app",
      "--disable-infobars",
      "--silent",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--start-fullscreen",
    ],
    defaultViewport: null,
    protocolTimeout: 120000,
  });
  const page = await browser.newPage();
  await page.goto(`file://${path.join(__dirname, "index.html")}`);
})();

app.listen(5500, () => console.log("File server running"));
