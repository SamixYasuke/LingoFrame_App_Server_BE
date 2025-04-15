import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";

const router = Router();

const authController = new AuthController();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authenticateAccessToken, authController.logoutUser);
router.post("/refresh-token", authController.getAccessToken);
router.post(
  "/request-verification",
  authenticateAccessToken,
  authController.requestEmailVerification
);
router.get("/verify-email", authController.verifyUserEmailController);

export default router;
