import mongoose, { Schema, Document } from "mongoose";

interface IPayment extends Document {
  user_id: string;
  amount: number;
  credits_purchased: number;
  paystack_ref: string;
  status: "pending" | "success" | "failed";
  created_at: Date;
  updated_at: Date;
}

const paymentSchema: Schema<IPayment> = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    credits_purchased: {
      type: Number,
      required: true,
    },
    paystack_ref: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"] as const,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
