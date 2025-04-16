import { Router } from "express";
import PaymentController from "../controllers/payment.controller";

const router = Router();

const paymentController = new PaymentController();

router.post(
  "/initiate/paystack",
  paymentController.initiatePaystackPaymentController
);

router.post(
  "/webhook/paystack",
  paymentController.paystackPaymentWebhookController
);

router.get(
  "/status/:payment_ref/paystack",
  paymentController.getPaymentStatusController
);

router.get("/", paymentController.getUserPaymentsController);

router.get("/bundles", paymentController.getCreditBundlesController);

export default router;
