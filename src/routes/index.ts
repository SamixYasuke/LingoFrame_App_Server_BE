import { Router } from "express";
import pingRouter from "./ping.route";
import authRouter from "./auth.route";
import videoRouter from "./video.route";

const router = Router();

router.use("/ping", pingRouter);
router.use("/auth", authRouter);
router.use("/video", videoRouter);

export default router;
