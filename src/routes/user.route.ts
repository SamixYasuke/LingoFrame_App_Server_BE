import { Router, Request, Response } from "express";
import UserController from "../controllers/user.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";

const router = Router();
const userController = new UserController();

router.get(
  "/credits",
  authenticateAccessToken,
  userController.getUserAvailableCredits
);

export default router;
