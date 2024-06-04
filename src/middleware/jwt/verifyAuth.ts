import { verify } from "jsonwebtoken";
import { config } from "../../config/config.config";
import { Request, Response, NextFunction } from "express";
import TokenException from "../../exceptions/TokenException";
import NoTokenException from "../../exceptions/NoTokenException";
import {prisma} from "../../utils/misc.utils";

require("dotenv").config();

/**
 * A middleware to validate the incoming request and get authorization token.
 */

const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
//get token from header
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  // console.log(token);
  if (!token) {
    return next(new NoTokenException());
  }

//verify user token
  verify(
    token,
    config.jwt.access_token.secret,
    async (err: any, decoded: any) => {
      if (err) {
        return next(new TokenException());
      }

      const tokenDoc = await prisma.userTokens.findUnique({
        where: {
          userId: decoded.userId,
          accessToken: token,
        },
      });
      if (!tokenDoc) {
        return next(new TokenException());
      }
      // @ts-ignore
      req.user = decoded;
      next();
    }
  );
};

export default verifyAuth;
