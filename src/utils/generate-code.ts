import { randomBytes } from "crypto";

export const generateRandom = (length = 8) => {
  const buffer = randomBytes(length);
  return buffer.toString("base64").replace(/\W/g, "");
};
