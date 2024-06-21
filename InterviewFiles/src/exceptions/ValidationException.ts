import { ValidationError } from "express-validator";
import CustomException from "./CustomException";
import httpStatus from "http-status";

class ValidationException extends CustomException {
  public statusCode = httpStatus.BAD_REQUEST;
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super("Oops! Validation Error Occurred!");
    this.errors = errors;

    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  serialize() {
    const errorDetails = this.errors.map((err: any) => ({
      message: err.msg,
      field: err.path,
    }));

    return {
      statusCode: this.statusCode,
      status: "error",
      message: this.message,
      errors: errorDetails,
    };
  }
}

export default ValidationException;