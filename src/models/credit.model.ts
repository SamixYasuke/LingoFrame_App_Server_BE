import mongoose, { Schema, Document } from "mongoose";

interface ICredit extends Document {
  user_id: string;
  credits: number;
  purchase_date: Date;
  expiry_date: Date;
  package_type: "starter" | "growth" | "pro" | "ultimate" | "free";
}

const creditSchema: Schema<ICredit> = new Schema({
  user_id: {
    type: String,
    required: true,
    ref: "User",
  },
  credits: {
    type: Number,
    required: true,
  },
  purchase_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  package_type: {
    type: String,
    enum: ["starter", "growth", "pro", "ultimate", "free"],
    required: true,
  },
});

creditSchema.index({ expiry_date: 1 });

const Credit = mongoose.model<ICredit>("Credit", creditSchema);

export default Credit;
