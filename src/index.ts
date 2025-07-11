import "dotenv/config";
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import helmet from "helmet";
import { userRouter } from "./routes/user";
import { fileRouter } from "./routes/file";

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const app = express();
const htmlPath = path.join(__dirname, "..", "index.html");
const PORT = process.env.PORT || 8080;

app.use(cors());
// app.use(
//   helmet({
//     crossOriginResourcePolicy: {
//       policy: "same-site",
//     },
//   })
// );
app.use(express.json());
app.use(express.static("assets"));
app.use("/start", express.static(htmlPath));
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/health", (req, res) => {
  res.json({
    status: "running",
  });
});

app.use("/user", userRouter);
app.use("/file", fileRouter);
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err);
    res.status(500).send("Something broke!");
  }
);

app.listen(PORT, () => console.log(`Server is running on port ${PORT} 📡`));
