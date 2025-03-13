import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  user_id: string;
  amount: number;
  credits_added: number;
  paystack_ref: string;
  status: "pending" | "success" | "failed";
  created_at: Date;
  updated_at: Date;
}

const transactionSchema: Schema<ITransaction> = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  credits_added: {
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
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;
