import CustomException from "./CustomException";
import IErrorMessage from "../interfaces/i.error.message";
// @ts-ignore
import httpStatus from "http-status";

class ForbiddenException extends CustomException {
  statusCode = httpStatus.FORBIDDEN

  constructor(message = "Unauthorized Access") {
    super(message);

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }

  serialize(): IErrorMessage {
    return {
      statusCode: this.statusCode,
      status: "error",
      message: this.message
    };
  }
}

export default ForbiddenException;
