import { StatusCodes } from "http-status-codes";
import express from "express";
import type { Request, Response } from "express";
import * as AuthService from "./auth.service";
import { verifyRefresh } from "../../utils/verify-refresh-token";
import { generateToken } from "../../utils/generate-token";
import { BadRequestError } from "../../errors";
import { authenticateUser } from "../../middlewares";

export const authRouter = express.Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { id, password } = req.body;

    await AuthService.register(id, password);

    return res.send({ status: "success" });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
});

authRouter.post("/signin", async (req: Request, res: Response) => {
  const { id, password } = req.body;

  try {
    const { token, refreshToken } = await AuthService.login(id, password);

    return res.send({ token, refreshToken });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
});

authRouter.post("/signin/new_token", async (req: Request, res: Response) => {
  const { id, refreshToken } = req.body;

  if (!id || !refreshToken) {
    throw new BadRequestError("Invalid body");
  }

  const isValid = verifyRefresh(id, refreshToken);
  if (!isValid) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, error: "Invalid token,try login again" });
  }

  const token = generateToken({
    userId: id,
    issueTime: new Date(),
  });

  return res.status(StatusCodes.OK).send({ token });
});

authRouter.get("/logout", authenticateUser, async (req: Request, res: Response) => {
  await AuthService.logout(req.body.user.userId);

  res
    .status(StatusCodes.OK)
    .json({ status: "success", msg: "Logged out successfully" });
});
