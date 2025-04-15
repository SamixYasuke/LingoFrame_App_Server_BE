import mongoose, { Schema, Document } from "mongoose";
import { hashPassword, verifyPassword } from "../utils/passwordHandler";

interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  credits: number;
  is_verified: boolean;
  verify_email_rate_limit: {
    count: number;
    first_request: Date;
    last_request: Date;
  };
  terms_accepted_at: Date;
  terms_accepted_ip: string;
  terms_accepted_device: string;
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
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
    required: false,
  },
  is_verified: {
    type: Boolean,
    required: false,
  },
  verify_email_rate_limit: {
    count: {
      type: Number,
      default: 0,
    },
    first_request: {
      type: Date,
      default: null,
    },
    last_request: {
      type: Date,
      default: null,
    },
  },
  terms_accepted_at: {
    type: Date,
    required: true,
  },
  terms_accepted_ip: {
    type: String,
    required: true,
  },
  terms_accepted_device: {
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

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return verifyPassword(this.password, candidatePassword);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
