import CustomException from "./CustomException";
import HttpStatus from "http-status";
import IErrorMessage from "../interfaces/i.error.message";

class NotFoundException extends CustomException {
  statusCode = HttpStatus.NOT_FOUND;

  constructor(message: string | null = null) {
    super(message || "Resource / Route Not found");

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }

  serialize(): IErrorMessage {
    return {
      statusCode: this.statusCode,
      status: "error",
      message: this.message
    };
  }
}

export default NotFoundException;
