import { Router } from "express";
import pingRouter from "./ping.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import videoRouter from "./video.route";
import paymentRouter from "./payment.route";
import RateLimiter from "../utils/rateLimiters";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";

const router = Router();
const rateLimiter = new RateLimiter();
const authRateLimiter = rateLimiter.getAuthRateLimiter();
const generalRateLimiter = rateLimiter.getGeneralRateLimiter();

router.use("/ping", pingRouter);
router.use("/auth", authRateLimiter, authRouter);
router.use("/video", authenticateAccessToken, generalRateLimiter, videoRouter);
router.use(
  "/payment",
  authenticateAccessToken,
  generalRateLimiter,
  paymentRouter
);
router.use("/user", authenticateAccessToken, generalRateLimiter, userRouter);

export default router;
