import { number } from "zod";
import { CustomError } from "../errors/CustomError";
import { User } from "../models"; // Assuming User is a Mongoose model
import { generateJwt, isValidEmail } from "../utils/helper";
import { httpStatusCodes } from "../utils/httpStatusCodes";
import { hashPassword, verifyPassword } from "../utils/passwordHandler";
import { checkPasswordStrength } from "../utils/passwordStrength";
import jwt from "jsonwebtoken";

interface UserResponse {
  email: string;
  created_at: Date;
  token?: string | number;
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

class AuthService {
  registerUserService = async (
    email: string,
    password: string
  ): Promise<UserResponse> => {
    if (!email || !password) {
      throw new CustomError("Email and password are required", 400);
    }

    if (!isValidEmail(email)) {
      throw new CustomError("Invalid email format", 400);
    }

    const passwordStrength = checkPasswordStrength(password);
    if (!passwordStrength.isStrong) {
      throw new CustomError(
        "Password does not meet strength requirements",
        400,
        passwordStrength.missing
      );
    }

    const user = await User.findOne({ email });
    if (user) {
      throw new CustomError("User already exists", 409);
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    const payload = {
      email: user.email,
      user_id: user._id,
    };
    const token = generateJwt(payload);

    return {
      email: savedUser.email,
      created_at: savedUser.created_at,
      token,
    };
  };

  loginUserService = async (
    email: string,
    password: string
  ): Promise<UserResponse> => {
    if (!email || !password) {
      throw new CustomError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const hashedPassword = user.password;
    const passwordMatch = await verifyPassword(hashedPassword, password);

    if (!passwordMatch) {
      throw new CustomError("Incorrect password", 401);
    }

    const payload = {
      email: user.email,
      user_id: user._id,
    };
    const token = generateJwt(payload);

    return {
      email: user.email,
      created_at: user.created_at,
      token,
    };
  };
}

export default AuthService;
