import axios from "axios";
import { CustomError } from "../errors/CustomError";
import { Payment, User } from "../models";
import crypto from "crypto";
import {
  PaystackInitializeTransactionResponse,
  PaystackWebhookEventBody,
  PaystackWebhookEventBodyData,
} from "../types/payment";
import { IPayment } from "../models/payment.model";
import { startSession } from "mongoose";
import { Logger } from "../utils/logger";

class PaymentService {
  private readonly PAYSTACK_SECRET: string;
  private readonly PAYSTACK_BASE_URL: string;
  private readonly MIN_CREDITS: number = 50;
  private readonly MIN_DOLLARS: number = 4.99;
  private readonly MAX_CREDITS_PER_PURCHASE: number = 280;
  private readonly DOLLAR_PER_CREDIT: number;
  private readonly EXCHANGE_RATE_USD_TO_NGN: number = 1600;
  private readonly MAX_CREDITS_TOTAL: number = 1000;

  constructor() {
    this.PAYSTACK_SECRET = process.env.PAYSTACK_SECRET ?? "";
    this.PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL ?? "";
    this.DOLLAR_PER_CREDIT = this.MIN_DOLLARS / this.MIN_CREDITS;

    if (!this.PAYSTACK_SECRET) {
      throw new Error("PAYSTACK_SECRET is required in environment variables");
    }

    if (!this.PAYSTACK_BASE_URL) {
      throw new Error("PAYSTACK_BASE_URL is required in environment variables");
    }
  }

  private calculateCreditCost(credits: number): { usd: number; ngn: number } {
    const costInDollars = credits * this.DOLLAR_PER_CREDIT;
    const costInNaira = costInDollars * this.EXCHANGE_RATE_USD_TO_NGN;

    return {
      usd: Number(costInDollars.toFixed(2)),
      ngn: Number(costInNaira.toFixed(2)),
    };
  }

  public async initiatePaystackPaymentService(
    credits: number,
    userId: string
  ): Promise<PaystackInitializeTransactionResponse> {
    if (!userId || typeof userId !== "string") {
      throw new CustomError("Invalid user ID", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const currentCredits = user.credits ?? 0;
    const newTotalCredits = currentCredits + credits;
    if (newTotalCredits > this.MAX_CREDITS_TOTAL) {
      throw new CustomError(
        `User credits (${currentCredits} + ${credits} = ${newTotalCredits}) would exceed maximum of ${
          this.MAX_CREDITS_TOTAL
        }. You can add up to ${
          this.MAX_CREDITS_TOTAL - currentCredits
        } more credits.`,
        400
      );
    }

    const costResult = this.calculateCreditCost(credits);
    const amountInKobo = Math.round(costResult.ngn * 100);

    try {
      const response = await axios.post(
        `${this.PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: user.email,
          amount: amountInKobo,
          currency: "NGN",
          callback_url: "https://animepahe.ru/",
          metadata: { credits },
        },
        {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET}`,
            "Content-Type": "application/json",
          },
        }
      );

      const payment = new Payment({
        user_id: userId,
        amount: costResult.ngn,
        status: "pending",
        paystack_ref: response.data.data.reference,
        credits_purchased: credits,
      });
      await payment.save();

      return response.data;
    } catch (error) {
      Logger.error("Payment initiation error:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new CustomError(
          error.response.data.message || "Payment initiation failed",
          error.response.status
        );
      }
      throw new CustomError("Payment initiation failed", 500);
    }
  }

  private async paystackChargeSuccessService(
    payment: IPayment,
    data: PaystackWebhookEventBodyData
  ): Promise<void> {
    const session = await startSession();
    try {
      session.startTransaction();

      const { customer, metadata, authorization } = data;
      const credits = Number(metadata?.credits);

      Logger.info(`Credits purchased: ${credits}`);

      if (!credits || isNaN(credits)) {
        throw new CustomError("Invalid credits value in metadata", 400);
      }

      const userUpdateResult = await User.updateOne(
        { email: customer.email },
        { $inc: { credits } },
        { session }
      );

      if (userUpdateResult.matchedCount === 0) {
        throw new CustomError("User not found", 404);
      }

      payment.credits_purchased = credits;
      payment.channel = authorization?.channel;
      payment.payment_country_code = authorization?.country_code;
      payment.status = "success";

      await payment.save({ session });
      await session.commitTransaction();

      Logger.info(`Added ${credits} credits to ${customer.email}`);
    } catch (error) {
      await session.abortTransaction();

      Logger.error("Charge success error:", error);
      throw error instanceof CustomError
        ? error
        : new CustomError("Failed to process successful payment", 500);
    } finally {
      session.endSession();
    }
  }

  private async paystackChargeFailedService(
    payment: IPayment,
    data: PaystackWebhookEventBodyData
  ): Promise<void> {
    payment.status = "failed";
    await payment.save();
    Logger.info(
      `Purchase of ${data.metadata.credits} credits failed for ${data.customer.email}`
    );
  }

  public async paystackPaymentWebhookService(
    body: PaystackWebhookEventBody,
    signature: string | string[]
  ): Promise<void> {
    const signatureStr = Array.isArray(signature) ? signature[0] : signature;

    if (!signatureStr) {
      throw new CustomError("Missing Paystack signature", 400);
    }

    const hash = crypto
      .createHmac("sha512", this.PAYSTACK_SECRET)
      .update(JSON.stringify(body))
      .digest("hex");

    if (hash !== signatureStr) {
      throw new CustomError("Invalid Paystack signature", 401);
    }

    const payment = await Payment.findOne({
      paystack_ref: body.data.reference,
    });
    if (!payment) {
      throw new CustomError("Payment record not found", 404);
    }

    Logger.info(`Event: ${body.event}`);

    switch (body.event) {
      case "charge.success":
        await this.paystackChargeSuccessService(payment, body.data);
        break;
      case "charge.failed":
        await this.paystackChargeFailedService(payment, body.data);
        break;
      default:
        Logger.warn(`Unhandled Paystack event: ${body.event}`);
        break;
    }
  }

  public getPaymentStatusService = async (
    userId: string,
    paymentRef: string
  ) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const payment = await Payment.findOne({
      user_id: userId,
      paystack_ref: paymentRef,
    }).select("-__v -user_id -createdAt -updatedAt");

    if (!payment) {
      throw new CustomError("Payment not found", 404);
    }

    return payment;
  };

  public getUserPaymentsService = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const payments = await Payment.find({ user_id: userId })
      .sort({ createdAt: -1 })

      .select("-__v -user_id -updatedAt");

    if (!payments || payments.length === 0) {
      throw new CustomError("No payments found for this user", 404, []);
    }

    return payments.map((payment) => {
      return {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        paystack_ref: payment.paystack_ref,
        credits_purchased: payment.credits_purchased,
        channel: payment.channel,
        payment_country_code: payment.payment_country_code,
        created_at: payment.createdAt,
      };
    });
  };
}

export default PaymentService;
