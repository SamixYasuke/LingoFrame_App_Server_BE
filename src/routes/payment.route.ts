import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";

const router = Router();

const paymentController = new PaymentController();

router.post(
  "/initiate/paystack",
  authenticateAccessToken,
  paymentController.initiatePaymentService
);

router.post("/webhook/paystack", paymentController.paymentWebhookController);

export default router;
