import { NextFunction, Request, Response } from "express";
import CustomException from "../exceptions/CustomException";
import { logger } from "../utils/logger.utils";
import httpStatus from "http-status";

/**
 * Error handler middleware.
 * Handles errors and exceptions thrown during request processing.
 *
 * @param err - The error or exception object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
const errorHandler = async (err: (Error | CustomException), req: Request, res: Response, next: NextFunction) => {

  if(err instanceof CustomException) {
    return res.status(err.statusCode).json(err.serialize());
  }

  logger.error(err);

  // Handling Prisma errors/exceptions
  if(err.constructor.name.includes("Prisma")) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      status: "error",
      message: "Internal server error",
      errors: err
    });
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    status: "error",
    message: "Internal Server Error",
    errors: err
  });
}

export default errorHandler;
