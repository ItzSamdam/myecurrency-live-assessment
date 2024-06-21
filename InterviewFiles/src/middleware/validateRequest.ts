import { validationResult } from "express-validator";
import ValidationException from "../exceptions/ValidationException";
import { NextFunction, Request, Response } from "express";


/**
 * Middleware function to validate the request using the provided validation rules.
 * If there are validation errors, it throws a ValidationException.
 * Otherwise, it calls the next middleware in the chain.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @throws {ValidationException} If there are validation errors.
 */
const validateRequest = (req: Request, res: Response ,next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ValidationException(errors.array());
  }

  next();
};

export default validateRequest;
