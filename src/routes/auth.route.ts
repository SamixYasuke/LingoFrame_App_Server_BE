import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";
import RateLimiter from "../utils/rateLimiters";

const router = Router();
const authController = new AuthController();
const rateLimiter = new RateLimiter();
const authRateLimiter = rateLimiter.getAuthRateLimiter();

router.post("/register", authRateLimiter, authController.registerUser);
router.post("/login", authRateLimiter, authController.loginUser);
router.post(
  "/logout",
  authenticateAccessToken,
  authRateLimiter,
  authController.logoutUser
);
router.post("/refresh-token", authRateLimiter, authController.getAccessToken);
router.post(
  "/request-verification",
  authenticateAccessToken,
  authController.requestEmailVerification
);
router.get(
  "/verify-email",
  authRateLimiter,
  authController.verifyUserEmailController
);

export default router;
