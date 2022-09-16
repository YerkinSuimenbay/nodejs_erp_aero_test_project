import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

interface CustonError extends Error {
  statusCode: StatusCodes;
}

export const errorHandler = (
  err: CustonError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something broke!",
  };

  res.status(customError.statusCode).json({ msg: customError.message, err });
};
