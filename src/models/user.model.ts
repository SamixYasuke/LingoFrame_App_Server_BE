import mongoose, { Schema, Document } from "mongoose";
import { hashPassword, verifyPassword } from "../utils/passwordHandler";

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
  credits: {
    type: Number,
    default: 3.0,
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

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return verifyPassword(this.password, candidatePassword);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
