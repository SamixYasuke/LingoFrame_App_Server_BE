import { Router, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import pingRouter from "./ping.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import videoRouter from "./video.route";
import paymentRouter from "./payment.route";
import { CustomError } from "../errors/CustomError";

const router = Router();

const rateLimiter = rateLimit({
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

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    const minutes = Math.floor(options.windowMs / 60000);
    const seconds = Math.floor((options.windowMs % 60000) / 1000);
    throw new CustomError(
      `Too many authentication attempts. Try again in ${minutes} minute(s) and ${seconds} second(s).`,
      429
    );
  },
});

router.use("/ping", rateLimiter, pingRouter);
router.use("/auth", authRateLimiter, authRouter);
router.use("/video", rateLimiter, videoRouter);
router.use("/payment", rateLimiter, paymentRouter);
router.use("/user", rateLimiter, userRouter);

export default router;
