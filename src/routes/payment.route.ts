import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";

const router = Router();

const paymentController = new PaymentController();

router.post("/", authenticateAccessToken, paymentController.sayHiController);

export default router;
