import { JWT_REFRESH_SECRET } from "./../constants";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "./generate-token";

export function verifyRefresh(userId: string, token: string) {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as IJwtPayload;
    return decoded.userId === userId;
  } catch (error) {
    return false;
  }
}
