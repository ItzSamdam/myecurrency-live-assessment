import express from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";
import httpStatus from "http-status";
import { logger } from "../utils/logger.utils";


const rateLimiter = new RateLimiterMemory({
  points: 10, // 5 requests
  duration: 1, // per 1 second by IP
  blockDuration: 60 * 60 * 1, // block for 1 hour, if more than 5 requests
  keyPrefix: "middleware"
})

/**
 * Middleware function to limit the rate of incoming requests based on IP address.
 * If the rate limit is exceeded, it returns an error response with status code 429 (Too Many Requests).
 * If no IP address is detected in the request, it returns an error response with status code 406 (Not Acceptable).
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
const rateLimiterMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  //@ts-ignore
  let ip = req?.user ? req?.user?.id : req?.clientIp;
  //@ts-ignore
  let userID = req?.user?.id
  if (!ip) {
    return res.status(httpStatus.NOT_ACCEPTABLE).json({
      statusCode: httpStatus.NOT_ACCEPTABLE,
      status: "error",
      message: "Can't Process Your Request, No IP Detected",
      errors: "No IP on Request"
    })
  }

  rateLimiter.consume(ip)
    .then(() => {
      next()
    })
    .catch((rateLimiterRes) => {
      logger.error("Too many requests from UserId (Can Be Undefined): ", userID)
      logger.error("Too many requests from IP (Can be IP or UserID but never undefined):", ip)
      logger.error(rateLimiterRes);
      return res.status(httpStatus.TOO_MANY_REQUESTS).json({
        statusCode: httpStatus.TOO_MANY_REQUESTS,
        status: "error",
        message: "Too many request, Try again in 1hr",
        errors: "Too many requests"
      })
    });
}

export default rateLimiterMiddleware;