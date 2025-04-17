import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";
import RateLimiter from "../utils/rateLimiters";

const router = Router();

const paymentController = new PaymentController();
const rateLimiter = new RateLimiter();
const userRateLimiter = rateLimiter.getUserRateLimiter();

router.post(
  "/initiate/paystack",
  authenticateAccessToken,
  userRateLimiter,
  paymentController.initiatePaystackPaymentController
);

router.post(
  "/webhook/paystack",
  paymentController.paystackPaymentWebhookController
);

router.get(
  "/status/:payment_ref/paystack",
  authenticateAccessToken,
  userRateLimiter,
  paymentController.getPaymentStatusController
);

router.get(
  "/",
  authenticateAccessToken,
  userRateLimiter,
  paymentController.getUserPaymentsController
);

router.get(
  "/bundles",
  authenticateAccessToken,
  userRateLimiter,
  paymentController.getCreditBundlesController
);

export default router;
