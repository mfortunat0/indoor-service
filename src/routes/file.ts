import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

const ciStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const client = req.body.client;
    const type = file.mimetype.split("/")[0];
    const pathFolder = path.join(__dirname, "..", "..", "assets", client);

    if (!fs.existsSync(pathFolder)) {
      fs.mkdirSync(pathFolder);
    }

    cb(null, pathFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadCi = multer({ storage: ciStorage });
const fileRouter = Router();

fileRouter.post("/", uploadCi.single("file"), (req, res) => {
  res.send();
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
  res.json({
    medias: fs.readdirSync(path.join(__dirname, "..", "..", "assets", client)),
  });
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
