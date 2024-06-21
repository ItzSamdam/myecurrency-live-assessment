import { Response, Request, NextFunction } from "express";
import httpStatus from "http-status";
//authorization
/**
 * Middleware to authorize user roles.
 * 
 * @param roles - An array of roles that are allowed to access the resource.
 * @returns A middleware function that checks if the user's role is included in the allowed roles.
 */
const authorizeUser = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    if (!roles.includes(req.user.role)) {
      res.status(httpStatus.FORBIDDEN).json({
        statusCode: httpStatus.FORBIDDEN,
        status: "error",
        //@ts-ignore
        message: `User with ${req.user.role} role is not permitted to access this resource`,
        data: null
      });
      return;
    }
    next();
  };
};

export default authorizeUser;
