import express from "express";
import type { Request, Response } from "express";

import * as FileService from "./file.service";
import { BadRequestError } from "../../errors";
import { LIMIT_SIZE, PAGE } from "../../constants";
import fileUpload from "express-fileupload";

export const fileRouter = express.Router();

fileRouter.post("/upload", async (req: Request, res: Response) => {
  if (!req.files || !req.files.file) {
    throw new BadRequestError("No file uploaded");
  }
  const { file } = req.files;

  if (Array.isArray(file)) {
    throw new BadRequestError("Single file can be uploaded only");
  }

  const path = await FileService.upload(file as fileUpload.UploadedFile);

  return res.send({ status: "success", path });
});

fileRouter.get("/list", async (req: Request, res: Response) => {
  const { list_size = LIMIT_SIZE, page = PAGE } = req.body;
  const offset = (page - 1) * list_size;

  const list = await FileService.list(list_size, offset);

  return res.send({ list });
});

fileRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = await FileService.findById(+id);
  if (!file) {
    throw new BadRequestError(`File with id ${id} does not exit`);
  }

  return res.json({ file });
});

fileRouter.delete("/delete/:id", async (req: Request, res: Response) => {
  const id = +req.params.id;

  await FileService.deleteFile(id);

  return res.status(200).send({ status: "success" });
});

fileRouter.get("/download/:id", async (req: Request, res: Response) => {
  const id = +req.params.id;
  const file = await FileService.findById(id);
  if (!file) {
    throw new BadRequestError("File does not exist");
  }

  const url = await FileService.download(file.path);

  res.download(url);
});

fileRouter.put("/update/:id", async (req: Request, res: Response) => {
  if (!req.files || !req.files.newFile) {
    throw new BadRequestError("No new file uploaded");
  }
  const { newFile } = req.files;

  if (Array.isArray(newFile)) {
    throw new BadRequestError("Single file can be uploaded only");
  }

  const id = +req.params.id;
  const file = await FileService.findById(id);
  if (!file) {
    throw new BadRequestError("File does not exist");
  }

  const newFileSaved = await FileService.save(newFile);

  const updatedFile = await FileService.update(file, newFileSaved);

  res.json({ status: "success", updatedFile });
});
