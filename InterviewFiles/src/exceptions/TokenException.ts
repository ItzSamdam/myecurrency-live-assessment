import IErrorMessage from "../interfaces/i.error.message";
import CustomException from "./CustomException";
import httpStatus from "http-status";

class TokenException extends CustomException {
  statusCode = httpStatus.UNAUTHORIZED;

  constructor() {
    super("Invalid or Expired Token");

    Object.setPrototypeOf(this, TokenException.prototype);
  }

  serialize(): IErrorMessage {
    return {
      statusCode: this.statusCode,
      status: "error",
      message: this.message
    };
  }
}

export default TokenException;
