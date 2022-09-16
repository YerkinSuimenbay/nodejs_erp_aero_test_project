import { unlink } from "fs";

export function deleteFileFs(path: string) {
  return new Promise<boolean>((resolve, reject) => {
    unlink(path, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
}
