import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const ciStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathFolder = path.join(__dirname, "..", "..", "assets");

    if (!fs.existsSync(pathFolder)) {
      console.log("Creating folder");
      fs.mkdirSync(pathFolder);
    }

    cb(null, pathFolder);
  },

  filename: function (req, file, cb) {
    const name = `final.${file.mimetype.replace("video/", "")}`;
    file.originalname = name;
    cb(null, name);
  },
});

const uploadCi = multer({ storage: ciStorage });
const fileRouter = Router();

fileRouter.post("/", uploadCi.single("file"), (req, res) => {
  try {
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

fileRouter.get("/stats/", (req, res) => {
  try {
    const pathFile = path.join(__dirname, "..", "..", "assets", "final.mp4");
    const status = fs.statSync(pathFile);
    res.json({ lastTime: status.ctimeMs });
  } catch (error) {
    res.status(500).send();
  }
});

export { fileRouter };
