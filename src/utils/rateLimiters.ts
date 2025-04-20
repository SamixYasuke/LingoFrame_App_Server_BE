import rateLimit from "express-rate-limit";
import { AuthenticatedRequest } from "../types/express";

class RateLimiter {
  private readonly WINDOW_MS = 15 * 60 * 1000;
  private readonly MAX_REQUESTS_PER_WINDOW = 100;
  private readonly MAX_REQUESTS_PER_WINDOW_AUTH = 15;

  private formatTime(windowMs: number): string {
    const minutes = Math.floor(windowMs / 60000);
    return `${minutes} minute(s)`;
  }

  public getUserRateLimiter() {
    return rateLimit({
      windowMs: this.WINDOW_MS,
      max: this.MAX_REQUESTS_PER_WINDOW,
      skip: (req) => req.method === "OPTIONS",
      keyGenerator: (req: AuthenticatedRequest) => {
        if (req.user?.user_id) return `user-${req.user.user_id}`;
        return req.ip;
      },
      handler: (req, res) => {
        res.status(429).json({
          status_code: 429,
          message: `Too many requests. Try again in ${this.formatTime(
            this.WINDOW_MS
          )}.`,
        });
      },
    });
  }

  public getAuthRateLimiter() {
    return rateLimit({
      windowMs: this.WINDOW_MS,
      max: this.MAX_REQUESTS_PER_WINDOW_AUTH,
      skip: (req) => req.method === "OPTIONS",
      handler: (req, res) => {
        res.status(429).json({
          status_code: 429,
          message: `Too many authentication attempts. Try again in ${this.formatTime(
            this.WINDOW_MS
          )}.`,
        });
      },
    });
  }
}

export default RateLimiter;
