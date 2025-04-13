import rateLimit from "express-rate-limit";
import { CustomError } from "../errors/CustomError";
import { Request, Response, NextFunction } from "express";

class RateLimiter {
  private readonly WINDOW_MS: number = 15 * 60 * 1000;
  private readonly MAX_REQUESTS_PER_WINDOW: number = 100;
  private readonly MAX_REQUESTS_PER_WINDOW_AUTH: number = 30;

  private formatTime(windowMs: number): string {
    const minutes = Math.floor(windowMs / 60000);
    return `${minutes} minute(s)`;
  }

  public generalRateLimiter = rateLimit({
    windowMs: this.WINDOW_MS,
    max: this.MAX_REQUESTS_PER_WINDOW,
    skip: (req: Request) => req.method === "OPTIONS",
    handler: (req: Request, res: Response, next: NextFunction) => {
      throw new CustomError(
        `Too many requests. Try again in ${this.formatTime(this.WINDOW_MS)}.`,
        429
      );
    },
  });

  public authRateLimiter = rateLimit({
    windowMs: this.WINDOW_MS,
    max: this.MAX_REQUESTS_PER_WINDOW_AUTH,
    skip: (req: Request) => req.method === "OPTIONS",
    handler: (req: Request, res: Response, next: NextFunction) => {
      throw new CustomError(
        `Too many authentication attempts. Try again in ${this.formatTime(
          this.WINDOW_MS
        )}.`,
        429
      );
    },
  });
}

export default RateLimiter;
