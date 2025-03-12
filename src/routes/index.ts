import { Router } from "express";
import pingRouter from "./ping.route";

const router = Router();

router.use("/ping", pingRouter);

export default router;
