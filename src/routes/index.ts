import { Router } from "express";
import pingRouter from "./ping.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import videoRouter from "./video.route";
import paymentRouter from "./payment.route";
import RateLimiter from "../utils/rateLimiters";

const router = Router();
const rateLimiter = new RateLimiter();
const { authRateLimiter, generalRateLimiter } = rateLimiter;

router.use("/ping", pingRouter);
router.use("/auth", authRateLimiter, authRouter);
router.use("/video", generalRateLimiter, videoRouter);
router.use("/payment", generalRateLimiter, paymentRouter);
router.use("/user", generalRateLimiter, userRouter);

export default router;
