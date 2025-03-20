import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { asyncHandler } from "../utils/asyncHandler";
import PaymentService from "../services/payment.service";

class PaymentController {
  private readonly paymentService: PaymentService;
  constructor() {
    this.paymentService = new PaymentService();
  }

  public sayHiController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const data = await this.paymentService.sayHiService(user_id);
      return res.status(200).json({
        status_code: 200,
        message: "Success",
        data,
      });
    }
  );
}

export default PaymentController;
