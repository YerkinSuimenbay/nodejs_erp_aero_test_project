import * as dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN!;

export const STORAGE_ROOT = process.env.STORAGE_ROOT!

export const LIMIT_SIZE = 10
export const PAGE = 1
