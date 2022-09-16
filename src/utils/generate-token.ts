import { JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET } from "./../constants";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../constants";
export interface IJwtPayload {
  userId: string;
  issueTime: Date
}

export function generateToken(payload: IJwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function generateRefreshToken(payload: IJwtPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

export function jwtSign(payload: IJwtPayload) {
  return {
    token: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
