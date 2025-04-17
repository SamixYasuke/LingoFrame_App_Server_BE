import { Router } from "express";
import pingRouter from "./ping.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import videoRouter from "./video.route";
import paymentRouter from "./payment.route";

const router = Router();

router.use("/ping", pingRouter);
router.use("/auth", authRouter);
router.use("/video", videoRouter);
router.use("/payment", paymentRouter);
router.use("/user", userRouter);

export default router;
