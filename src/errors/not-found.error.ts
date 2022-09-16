import { StatusCodes } from "http-status-codes";
import { CustomApiError } from ".";

export class NotFoundError extends CustomApiError {
    statusCode: StatusCodes
    constructor(message: string) {
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}
