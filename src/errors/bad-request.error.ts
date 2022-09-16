import { CustomApiError } from ".";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends CustomApiError {
  statusCode: StatusCodes;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
