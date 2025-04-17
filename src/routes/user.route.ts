import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";
import RateLimiter from "../utils/rateLimiters";

const router = Router();
const userController = new UserController();
const rateLimiter = new RateLimiter();
const userRateLimiter = rateLimiter.getUserRateLimiter();

router.get(
  "/",
  authenticateAccessToken,
  userRateLimiter,
  userController.getUserDetailsController
);

router.get(
  "/credits",
  authenticateAccessToken,
  userRateLimiter,
  userController.getUserAvailableCredits
);

export default router;
