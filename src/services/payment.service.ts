import axios from "axios";
import { CustomError } from "../errors/CustomError";
import { Payment, User } from "../models";
import crypto from "crypto";
import { PaystackInitializeTransactionResponse } from "../types/payment";

class PaymentService {
  private readonly PAYSTACK_SECRET: string;
  private readonly PAYSTACK_BASE_URL: string;
  private readonly CREDIT_OPTIONS: { [key: number]: number };

  constructor() {
    this.PAYSTACK_SECRET = process.env.PAYSTACK_SECRET || "";
    this.PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || "";
    this.CREDIT_OPTIONS = {
      50: 20000, // ₦20,000 in Naira
      100: 40000, // ₦40,000 in Naira
      250: 100000, // ₦100,000 in Naira
    };

    if (!this.PAYSTACK_SECRET || !this.PAYSTACK_BASE_URL) {
      throw new Error(
        "PAYSTACK_SECRET or PAYSTACK_BASE_URL is not defined in environment variables"
      );
    }
  }

  public initiatePaymentService = async (
    credits: number,
    userId: string
  ): Promise<PaystackInitializeTransactionResponse> => {
    if (!(credits in this.CREDIT_OPTIONS)) {
      throw new CustomError("Invalid credit amount", 400);
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

  public paymentWebhookService = async (
    body: {
      event: string;
      data: {
        customer: {
          first_name: string;
          last_name: string;
          email: string;
        };
        amount: number;
        metadata: { credits: number };
        reference: string;
      };
    },
    signature: string | string[]
  ): Promise<void> => {
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

    if (event === "charge.success") {
      const { customer, metadata } = data;
      const { email } = customer;
      const { credits } = metadata;
      const user = await User.findOne({ email });
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      if (amountInNairaFromPaystack !== this.CREDIT_OPTIONS[credits]) {
        throw new CustomError("Amount mismatch", 400);
      }
      await User.updateOne({ email }, { $inc: { credits: credits } });
      payment.credits_purchased = credits;
      payment.status = "success";
      await payment.save();
      console.log(`Added ${credits} credits to ${email}`);
    } else if (event === "charge.failed") {
      payment.status = "failed";
      await payment.save();
      console.log(
        `Purchase of ${data.metadata.credits} credits failed for ${data.customer.email}`
      );
    }
  };
}

export default PaymentService;
