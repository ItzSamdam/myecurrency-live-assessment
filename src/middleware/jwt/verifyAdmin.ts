import { verify } from "jsonwebtoken";
import { config } from "../../config/config.config";
import { Request, Response, NextFunction } from "express";
import TokenException from "../../exceptions/TokenException";
import NoTokenException from "../../exceptions/NoTokenException";

require("dotenv").config();

/**
 * A middleware to validate the incoming request and get authorization token.
 */

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
//get token from header
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    return next(new NoTokenException());
  }

//verify user token
  verify(
    token,
    config.jwt.access_token.secret,
    (err: any, decoded: any) => {
      if (err) {
        return next(new TokenException());
      }
      // @ts-ignore
      req.admin = decoded;
      next();
    }
  );
};

export default verifyAdmin;
