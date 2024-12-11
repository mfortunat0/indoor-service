import liveServer from "live-server";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";

const configLiveServer = {
  port: 5500,
  file: "index.html",
};

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

liveServer.start(configLiveServer);
app.listen(5501, () => console.log("File server running"));
