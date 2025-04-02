import mongoose, { Schema, Document } from "mongoose";
import { hashPassword, verifyPassword } from "../utils/passwordHandler";
import Credit from "./credit.model";

interface IUser extends Document {
  email: string;
  password: string;
  credits: number;
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("password")) {
      this.password = await hashPassword(this.password);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.post("save", async function () {
  try {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setDate(currentDate.getDate() + 3); // Add 3 days correctly
    const newUserCredit = new Credit({
      user_id: this._id,
      credits: 10,
      purchase_date: currentDate,
      expiry_date: expiryDate,
      package_type: "free",
    });
    await newUserCredit.save();
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return verifyPassword(this.password, candidatePassword);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
