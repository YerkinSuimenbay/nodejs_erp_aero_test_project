require("express-async-errors");
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";

import { authenticateUser, errorHandler, notFound } from "./middlewares";
import { authRouter } from "./modules/auth/auth.router";
import { fileRouter } from "./modules/file/file.router";
import { infoRouter } from "./modules/info/info.router";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 7070;

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => res.send("Hello world!"));
app.use("/auth", authRouter);
app.use("/file", fileRouter);
app.use("/info", authenticateUser, infoRouter);

app.use(notFound);
app.use(errorHandler);

function main() {
  try {
    app.listen(PORT, () =>
      console.log(`Server is running at https://localhost:${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
}

main();