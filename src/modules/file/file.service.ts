import { generateRandom } from "./../../utils/generate-code";
import fileUpload from "express-fileupload";
import { readFile } from "fs";
import { join } from "path";
import { deleteFileFs } from "../../delete-file-fs";
import { BadRequestError } from "../../errors";
import { db } from "../../utils/db.server";
import { getFileExtension } from "../../utils/get-file-extension";

export interface IFile {
  id?: number;
  name: string;
  extension: string;
  mimetype: string;
  size: number;
  path: string;
  createdAt?: Date;
}

export function list(limit_size: number, offset: number): Promise<IFile[]> {
  return db.file.findMany({
    take: limit_size,
    skip: offset,
  });
}

export function findById(id: number): Promise<IFile | null> {
  return db.file.findFirst({ where: { id } });
}

export async function upload(file: fileUpload.UploadedFile) {
  const { name, extension, size, mimetype, path } = await save(file);
  await db.file.create({
    data: {
      name,
      extension,
      size,
      mimetype,
      path,
    },
  });

  return path;
}

export async function deleteFile(id: number) {
  if (!id) {
    throw new BadRequestError("Invalid params");
  }

  const file = await db.file.findFirst({ where: { id } });
  if (!file) {
    throw new BadRequestError("File does not exist");
  }
  await db.file.delete({ where: { id } });

  const { path } = file;
  const url = join(__dirname, `../../${path}`);
  await deleteFileFs(url);

  return true;
}

export async function download(path: string) {
  const url = join(__dirname, `../../${path}`);
  return new Promise<string>((resolve, reject) => {
    readFile(url, (err, file) => {
      if (err) {
        console.log(err);
        reject(new Error("Could not download file"));
      }

      resolve(url);
    });
  });
}

export async function update(file: IFile, newFile: IFile) {
  const url = join(__dirname, `../../${file.path}`);

  await deleteFileFs(url);

  return db.file.update({ where: { id: file.id }, data: newFile });
}

export async function save(file: fileUpload.UploadedFile): Promise<IFile> {
  const { mimetype, size } = file;
  const extension = getFileExtension(file.name);

  const name = generateRandom();
  const folderName = "uploads";
  const path = `${folderName}/${name}.${extension}`;
  const url = join(__dirname, `../../${path}`);
  await file.mv(url);

  return { name, extension, size, mimetype, path };
}
