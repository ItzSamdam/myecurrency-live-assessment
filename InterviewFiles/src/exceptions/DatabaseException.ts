import CustomException from "./CustomException";
import IErrorMessage from "../interfaces/i.error.message";
import httpStatus from "http-status";

interface CustomValidationError {
  field: string;
  message: string;
}

class DatabaseException extends CustomException {
  public statusCode = httpStatus.SERVICE_UNAVAILABLE;
  public error: CustomValidationError | any;
  prismaErrorData: any;

  constructor(errorData: any) {
    super("prisma client known validation error");
    this.error = "";
    this.prismaErrorData = errorData;

    Object.setPrototypeOf(this, DatabaseException.prototype);
  }


  serialize(): IErrorMessage {
    const { code } = this.prismaErrorData;
    switch (code) {
      case "P2010":
        return {
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          status: "error",
          message: "Internal Server Error",
          field: {
            error: "Access denied to database",
            code: 500
          }
        };
      case "P2023":
        return {
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          status: "error",
          message: "Internal Server Error",
          field: {
            error: "Invalid Object Id",
            code: 500
          }
        };
      default:
        return {
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          status: "error",
          message: "Internal Server Errror",
          field: {
            error: "Validation Error on Prisma Client",
            code: 500
          }
        };
    }
  }
}

export default DatabaseException;