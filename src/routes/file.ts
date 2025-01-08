import { Router } from "express";
import { exec } from "child_process";
import { v4 as uuid } from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs";

const ciStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const client = req.body.client;
    const pathFolder = path.join(__dirname, "..", "..", "assets", client);

    if (!fs.existsSync(pathFolder)) {
      fs.mkdirSync(pathFolder);
    }

    cb(null, pathFolder);
  },
  filename: function (req, file, cb) {
    const name = uuid();
    file.originalname = name;
    cb(null, name);
  },
});

const uploadCi = multer({ storage: ciStorage });
const fileRouter = Router();

fileRouter.post("/", uploadCi.single("file"), (req, res) => {
  try {
    if (req.file) {
      console.log(req.file);
      exec(
        `ffmpeg -i ${req.file.path} -vcodec h264 -acodec aac ${path.join(
          __dirname,
          "..",
          "..",
          "assets",
          "example",
          req.file.originalname + ".mp4"
        )}`,
        (error) => {
          if (error) {
            console.log(error);
          }

          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          res.send();
        }
      );
    }
  } catch (error) {
    res.status(500).send();
  }
});

fileRouter.post("/generate", (req, res) => {
  const { client } = req.body;

  const fileNames: string[] = req.body.fileNames;
  const folderPath = path.join(__dirname, "..", "..", "assets", client);
  let list = "";

  for (const name of fileNames) {
    const exists = fs.existsSync(path.join(folderPath, name));
    list += `file '${name}' \n`;
    if (!exists) {
      res.status(400).send();
      return;
    }
  }

  const filePath = path.join(folderPath, "final.mp4");
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const listPath = path.join(folderPath, "list.txt");
  if (fs.existsSync(listPath)) {
    fs.unlinkSync(listPath);
  }

  fs.writeFileSync(listPath, list, "utf-8");

  exec(
    `ffmpeg -f concat -i ${listPath} -c copy ${filePath}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
      }
      res.send();
    }
  );
});

fileRouter.delete("/", (req, res) => {
  const { client, name } = req.body;
  fs.unlinkSync(path.join(__dirname, "..", "..", "assets", client, name));
  res.status(201).send();
});

fileRouter.get("/list/:client", (req, res) => {
  const { client } = req.params;

  if (fs.existsSync(path.join(__dirname, "..", "..", "assets", client))) {
    const files = fs.readdirSync(
      path.join(__dirname, "..", "..", "assets", client)
    );

    res.json({
      medias: files.filter((fileName) => fileName !== "final.mp4"),
    });
    return;
  } else {
    res.status(404).send();
  }
});

fileRouter.get("/stats/:client", (req, res) => {
  const { client } = req.params;
  const pathFile = path.join(
    __dirname,
    "..",
    "..",
    "assets",
    client,
    "final.mp4"
  );
  const status = fs.statSync(pathFile);
  res.json({ lastTime: status.ctimeMs });
});

export { fileRouter };
