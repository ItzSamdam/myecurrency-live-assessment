import IErrorMessage from "../interfaces/i.error.message";
import CustomException from "./CustomException";
import httpStatus from "http-status";

/**
 * Represents an exception that occurs when a bad request is made.
 */
class BadRequestException extends CustomException {
  public statusCode = httpStatus.BAD_REQUEST;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestException.prototype);
  }

  /**
   * Serializes the exception into an error message object.
   * @returns The serialized error message object.
   */
  serialize(): IErrorMessage {
    return {
      statusCode: this.statusCode,
      status: "error",
      message: this.message
    };
  }
}

export default BadRequestException;
