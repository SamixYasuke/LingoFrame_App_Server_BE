import { Response, Request } from "express";
import { AuthenticatedRequest } from "../types/express";
import { asyncHandler } from "../utils/asyncHandler";
import PaymentService from "../services/payment.service";

class PaymentController {
  private readonly paymentService: PaymentService;
  constructor() {
    this.paymentService = new PaymentService();
  }

  public initiatePaymentService = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const { credits } = req.body;
      const data = await this.paymentService.initiatePaymentService(
        credits,
        user_id
      );
      return res.status(201).json({
        status_code: 201,
        message: "Payment Initiated Successfully",
        data,
      });
    }
  );

  public paymentWebhookController = asyncHandler(
    async (req: Request, res: Response) => {
      const event = req.body;
      const signature = req.headers["x-paystack-signature"];
      await this.paymentService.paymentWebhookService(event, signature);
      res.sendStatus(200);
    }
  );
}

export default PaymentController;
