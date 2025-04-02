import axios from "axios";
import { CustomError } from "../errors/CustomError";
import { Credit, Payment, User } from "../models";
import crypto from "crypto";
import {
  PaystackInitializeTransactionResponse,
  PaystackWebhookEventBody,
  PaystackWebhookEventBodyData,
} from "../types/payment";
import { IPayment } from "../models/payment.model";
import { startSession } from "mongoose";

class PaymentService {
  private readonly PAYSTACK_SECRET: string;
  private readonly PAYSTACK_BASE_URL: string;
  private readonly CREDIT_OPTIONS: Record<number, number>;
  private readonly PACKAGE_TYPES: Record<string, number>;
  private readonly EXPIRY_PERIODS_IN_MONTHS: Record<string, number>;

  constructor() {
    this.PAYSTACK_SECRET = process.env.PAYSTACK_SECRET || "";
    this.PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || "";
    this.CREDIT_OPTIONS = {
      50: 7653.49, // ₦7,653.49 in Naira
      110: 15323.66, // ₦15,323.66 in Naira
      280: 38344.92, // ₦38,344.92 in Naira
      575: 76691.92, // ₦76,691.92 in Naira
    };
    this.PACKAGE_TYPES = {
      starter: 50,
      growth: 110,
      pro: 280,
      ultimate: 575,
    };
    this.EXPIRY_PERIODS_IN_MONTHS = {
      starter: 1, // months
      growth: 2, // months
      pro: 3, // months
      ultimate: 6, // months
    };

    if (!this.PAYSTACK_SECRET) {
      throw new Error("PAYSTACK_SECRET is required in environment variables");
    }

    if (!this.PAYSTACK_BASE_URL) {
      throw new Error("PAYSTACK_BASE_URL is required in environment variables");
    }
  }

  public initiatePaystackPaymentService = async (
    credits: number,
    package_type: string,
    userId: string
  ): Promise<PaystackInitializeTransactionResponse> => {
    if (typeof credits !== "number" || !(credits in this.CREDIT_OPTIONS)) {
      throw new CustomError("Invalid credit amount", 400);
    }

    const package_types = ["starter", "growth", "pro", "ultimate"];

    if (!package_types.includes(package_type)) {
      throw new CustomError("Invalid package type", 400);
    }

    const packageTypeCredit = this.PACKAGE_TYPES[package_type];

    if (credits !== packageTypeCredit) {
      throw new CustomError(
        `Credits for ${package_type} package should be ${packageTypeCredit}`,
        400
      );
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    const { email } = user;

    const amountInNaira = this.CREDIT_OPTIONS[credits]; // Naira
    const amountInKobo = amountInNaira * 100; // Convert to kobo for Paystack

    try {
      const response = await axios.post(
        `${this.PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email,
          amount: amountInKobo,
          currency: "NGN",
          callback_url: "https://animepahe.ru/",
          metadata: { credits, package_type },
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
        amount: amountInNaira,
        status: "pending",
        paystack_ref: response.data.data.reference,
        credits_purchased: credits,
      });
      await payment.save();

      return response.data;
    } catch (error) {
      const paystackError = error.response?.data;
      console.error("Paystack error:", paystackError || error.message);
      throw new CustomError(
        paystackError?.message || "Payment initiation failed",
        paystackError?.code === "unsupported_currency" ? 400 : 500
      );
    }
  };

  private paystackChargeSuccessService = async (
    payment: IPayment,
    data: PaystackWebhookEventBodyData,
    amountInNairaFromPaystack: number
  ) => {
    const { customer, metadata, authorization } = data;
    const { email } = customer;
    const { credits: rawCredits, package_type } = metadata;

    if (!rawCredits || !package_type) {
      throw new CustomError("Missing payment metadata", 400);
    }

    const credits = Number(rawCredits);

    if (isNaN(credits)) {
      throw new CustomError("Invalid credits value in metadata", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    if (amountInNairaFromPaystack !== this.CREDIT_OPTIONS[credits]) {
      throw new CustomError("Amount mismatch", 400);
    }

    if (!Object.keys(this.PACKAGE_TYPES).includes(package_type)) {
      throw new CustomError("Invalid package type", 400);
    }

    if (this.PACKAGE_TYPES[package_type] !== credits) {
      throw new CustomError("Credits mismatch with package type", 400);
    }

    const months = this.EXPIRY_PERIODS_IN_MONTHS[package_type];
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);

    const newCreditPackage = new Credit({
      user_id: user._id,
      credits: this.PACKAGE_TYPES[package_type],
      purchase_date: new Date(),
      expiry_date: expiryDate,
      package_type,
    });

    payment.credits_purchased = credits;
    payment.channel = authorization?.channel;
    payment.payment_country_code = authorization?.country_code;
    payment.status = "success";

    try {
      await Promise.all([await newCreditPackage.save(), await payment.save()]);
      console.log(`Added ${credits} credits to ${email}`);
    } catch (dbError) {
      console.error("Database save error:", dbError);
      throw new CustomError("Failed to update database", 500);
    }
  };

  private paystackChargeFailedService = async (
    payment: IPayment,
    data: PaystackWebhookEventBodyData
  ) => {
    payment.status = "failed";
    try {
      await payment.save();
      console.log(
        `Purchase of ${data.metadata.credits} credits failed for ${data.customer.email}`
      );
    } catch (dbError) {
      console.error("Failed payment save error:", dbError);
      throw new CustomError("Failed to update payment status", 500);
    }
  };

  public paystackPaymentWebhookService = async (
    body: PaystackWebhookEventBody,
    signature: string | string[]
  ): Promise<void> => {
    try {
      if (!signature) {
        throw new CustomError("Missing Paystack signature", 400);
      }

      const hash = crypto
        .createHmac("sha512", this.PAYSTACK_SECRET)
        .update(JSON.stringify(body))
        .digest("hex");

      if (hash !== signature) {
        throw new CustomError("Invalid Paystack signature", 400);
      }

      const { event, data } = body;
      const payment = await Payment.findOne({ paystack_ref: data.reference });

      if (!payment) {
        throw new CustomError("Payment record not found", 404);
      }

      const amountInNairaFromPaystack = data.amount / 100; // Convert kobo to Naira

      switch (event) {
        case "charge.success": {
          await this.paystackChargeSuccessService(
            payment,
            data,
            amountInNairaFromPaystack
          );
          break;
        }
        case "charge.failed": {
          await this.paystackChargeFailedService(payment, data);
          break;
        }
        default:
          console.log(`Unhandled Paystack event: ${event}`);
          break;
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
      throw error instanceof CustomError
        ? error
        : new CustomError("Webhook processing failed", 500);
    }
  };
}

export default PaymentService;
