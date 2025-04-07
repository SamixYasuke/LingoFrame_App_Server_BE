import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

const authController = new AuthController();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.getAccessToken);

export default router;
