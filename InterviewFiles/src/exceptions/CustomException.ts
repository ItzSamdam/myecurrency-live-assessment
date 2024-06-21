import IErrorMessage from "../interfaces/i.error.message";
import HttpStatus from "http-status";

abstract class CustomException extends Error {
  public statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
  public message: string;

  protected constructor(message: string ) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, CustomException.prototype);
  }

  abstract serialize(): IErrorMessage;
}

export default CustomException
