import { Response, Request } from "express";
import { AuthenticatedRequest } from "../types/express";
import { asyncHandler } from "../utils/asyncHandler";
import PaymentService from "../services/payment.service";

class PaymentController {
  private readonly paymentService: PaymentService;
  constructor() {
    this.paymentService = new PaymentService();
  }

  public initiatePaystackPaymentController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const credits = req.body.credits;
      const data = await this.paymentService.initiatePaystackPaymentService(
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

  public paystackPaymentWebhookController = asyncHandler(
    async (req: Request, res: Response) => {
      const event = req.body;
      const signature = req.headers["x-paystack-signature"];
      await this.paymentService.paystackPaymentWebhookService(event, signature);
      res.sendStatus(200);
    }
  );

  public getPaymentStatusController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const payment_ref = req.params.payment_ref;
      const data = await this.paymentService.getPaymentStatusService(
        user_id,
        payment_ref
      );
      return res.status(200).json({
        status_code: 200,
        message: "Payment Status Retrieved Successfully",
        data,
      });
    }
  );

  public getUserPaymentsController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const data = await this.paymentService.getUserPaymentsService(user_id);
      return res.status(200).json({
        status_code: 200,
        message: "User Payments Retrieved Successfully",
        data,
      });
    }
  );
}

export default PaymentController;
