import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";

const router = Router();

const paymentController = new PaymentController();

router.post(
  "/initiate/paystack",
  authenticateAccessToken,
  paymentController.initiatePaystackPaymentController
);

router.post(
  "/webhook/paystack",
  paymentController.paystackPaymentWebhookController
);

router.get(
  "/status/:payment_ref/paystack",
  authenticateAccessToken,
  paymentController.getPaymentStatusController
);

router.get(
  "/",
  authenticateAccessToken,
  paymentController.getUserPaymentsController
);

export default router;
