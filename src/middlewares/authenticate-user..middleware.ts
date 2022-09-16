import { StatusCodes } from 'http-status-codes';
import moment from "moment";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { UnauthenticatedError } from "../errors";
import { IJwtPayload } from "../utils/generate-token";
import * as UserService from "../modules/user/user.service";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as IJwtPayload;

    const user = await UserService.getLastLougoutTimeByUserId(payload.userId);

    if (
      user?.lastLogoutTime &&
      moment(payload.issueTime).isBefore(moment(user.lastLogoutTime))
    ) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: "error",
        msg: "Invalid token. Please, signin again",
      });
    }

    req.body.user = {
      userId: payload.userId,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export { authenticateUser };
