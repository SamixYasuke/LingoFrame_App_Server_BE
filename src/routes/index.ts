import { Router } from "express";
import pingRouter from "./ping.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import videoRouter from "./video.route";
import paymentRouter from "./payment.route";
import { authRateLimiter, rateLimiter } from "../utils/rateLimiters";

const router = Router();

router.use("/ping", pingRouter);
router.use("/auth", authRateLimiter, authRouter);
router.use("/video", rateLimiter, videoRouter);
router.use("/payment", rateLimiter, paymentRouter);
router.use("/user", rateLimiter, userRouter);

export default router;
