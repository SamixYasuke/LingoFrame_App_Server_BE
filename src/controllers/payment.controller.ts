import { Response, Request } from "express";
import { AuthenticatedRequest } from "../types/express";
import { asyncHandler } from "../utils/asyncHandler";
import PaymentService from "../services/payment.service";
import { createPaymentDTO } from "../dtos/payment.dto";
import { flattenZodErrors } from "../utils/helper";
import { CustomError } from "../errors/CustomError";

class PaymentController {
  private readonly paymentService: PaymentService;
  constructor() {
    this.paymentService = new PaymentService();
  }

  public initiatePaystackPaymentController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const validatedReqBody = createPaymentDTO.safeParse(req.body);

      const { data: validatedData, error: validationError } = validatedReqBody;

      if (!validatedReqBody.success) {
        const errorMessages = flattenZodErrors(validationError);
        throw new CustomError("Validation Failed", 400, errorMessages);
      }

      const bundle_price = validatedData.bundle_price;
      const data = await this.paymentService.initiatePaystackPaymentService(
        bundle_price,
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

  public getCreditBundlesController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const data = this.paymentService.getCreditBundles();
      return res.status(200).json({
        status_code: 200,
        message: "Credit Bundle Retrieved Successfully",
        data,
      });
    }
  );
}

export default PaymentController;
