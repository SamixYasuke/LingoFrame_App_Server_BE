import { Router } from "express";
import pingRouter from "./ping.route";
import authRouter from "./auth.route";

const router = Router();

router.use("/ping", pingRouter);
router.use("/auth", authRouter);

export default router;
