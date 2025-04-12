import rateLimit from "express-rate-limit";
import { CustomError } from "../errors/CustomError";
import { Request, Response, NextFunction } from "express";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    const minutes = Math.floor(options.windowMs / 60000);
    const seconds = Math.floor((options.windowMs % 60000) / 1000);
    throw new CustomError(
      `Too many requests. Try again in ${minutes} minute(s) and ${seconds} second(s).`,
      429
    );
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    const minutes = Math.floor(options.windowMs / 60000);
    throw new CustomError(
      `Too many authentication attempts. Try again in ${minutes} minute(s)`,
      429
    );
  },
});
