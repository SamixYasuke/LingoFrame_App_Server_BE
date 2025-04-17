import mongoose from "mongoose";
import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";
import { CustomError } from "../errors/CustomError";
import { User } from "../models";
import { generateJwt, isValidEmail, verifyJwt } from "../utils/helper";
import { checkPasswordStrength } from "../utils/passwordHandler";
import EmailService from "./email.service";
import { Logger } from "../utils/logger";

interface UserResponse {
  email?: string;
  data?: {
    access_token: string;
    refresh_token: string;
  };
  created_at?: Date;
}

class AuthService {
  private readonly ACCESS_TOKEN_VALIDITY: string = "24h";
  private readonly REFRESH_TOKEN_VALIDITY: string = "7d";
  private readonly emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  public registerUserService = async (
    userData: CreateUserDto
  ): Promise<UserResponse> => {
    const { email, password, terms_accepted_at } = userData;

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

    const newUser = new User({
      ...userData,
      terms_accepted_at: new Date(terms_accepted_at),
    });
    const savedUser = await newUser.save();

    const payload = {
      email: savedUser.email,
      user_id: savedUser._id,
    };

    const accessToken = generateJwt(payload, this.ACCESS_TOKEN_VALIDITY);
    const refreshToken = generateJwt(payload, this.REFRESH_TOKEN_VALIDITY);

    return {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  };

  public loginUserService = async (
    loginInfo: LoginUserDto
  ): Promise<UserResponse> => {
    const { email, password } = loginInfo;

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      throw new CustomError("Incorrect password", 401);
    }

    const payload = {
      email: user.email,
      user_id: user._id,
    };
    const accessToken = generateJwt(payload, this.ACCESS_TOKEN_VALIDITY);
    const refreshToken = generateJwt(payload, this.REFRESH_TOKEN_VALIDITY);

    return {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  };

  public async getAccessTokenService(
    refreshToken: string
  ): Promise<string | false> {
    const decoded = verifyJwt(refreshToken);

    if (!decoded || typeof decoded !== "object") {
      return false;
    }

    const { email, user_id } = decoded;

    const accessToken = generateJwt(
      { email, user_id },
      this.ACCESS_TOKEN_VALIDITY
    );

    Logger.info(`ACCESS TOKEN REQUESTED BY: ${user_id}`);

    return accessToken;
  }

  public async requestEmailVerification(userId: string) {
    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw new CustomError("Invalid or No User Id Provided", 400);
    }

    const user = await User.findById(userId).select(
      "_id email is_verified first_name last_name verify_email_rate_limit"
    );

    if (!user) {
      throw new CustomError("User Not Found", 404);
    }

    if (user.is_verified) {
      throw new CustomError("User's Email Already Verified", 409);
    }

    const now = Date.now();
    const { first_request, last_request } = user.verify_email_rate_limit;
    const RATE_LIMIT_WINDOW_MS = 300000; // 5 minutes
    const MAX_REQUESTS = 3;

    if (
      last_request &&
      now - first_request.getTime() < RATE_LIMIT_WINDOW_MS &&
      user.verify_email_rate_limit.count >= MAX_REQUESTS
    ) {
      const timeLeft = Math.ceil(
        (RATE_LIMIT_WINDOW_MS - (now - first_request.getTime())) / 1000 / 60
      );
      throw new CustomError(
        `You've made too many verification requests!!!. Please try again in ${timeLeft} minute${
          timeLeft > 1 ? "s" : ""
        }.`,
        429
      );
    }

    if (
      !first_request ||
      now - first_request.getTime() >= RATE_LIMIT_WINDOW_MS
    ) {
      user.verify_email_rate_limit = {
        count: 1,
        first_request: new Date(),
        last_request: new Date(),
      };
    } else {
      user.verify_email_rate_limit.count += 1;
      user.verify_email_rate_limit.last_request = new Date();
    }

    await user.save();

    const payload = {
      user_id: userId,
    };

    const jwt = generateJwt(payload, "3h");
    const verificationLink = `https://lingoframe-landing-page.vercel.app/verify?token=${jwt}`;

    const emailData: any = {
      userName: user?.first_name,
      toEmail: user?.email,
      verificationLink: verificationLink,
    };

    await this.emailService.sendVerificationEmail(emailData);
  }

  public async verifyUserEmail(token: any) {
    const decoded = verifyJwt(token);

    if (!decoded || typeof decoded !== "object") {
      throw new CustomError("Something Is Wrong, Corrupted Data", 400);
    }

    const { user_id } = decoded;

    if (!user_id || !mongoose.isValidObjectId(user_id)) {
      throw new CustomError("Invalid or No User Id Provided", 400);
    }

    const user = await User.findById(user_id).select("_id email is_verified");

    if (!user) {
      throw new CustomError("User Not Found", 404);
    }

    if (user.is_verified) {
      throw new CustomError("User's Email Already Verified", 409);
    }

    const updatedUser = await User.findByIdAndUpdate(user_id, {
      $set: { is_verified: true },
      $inc: { credits: 25 },
    });

    if (!updatedUser) {
      throw new CustomError("Failed to verify email", 500);
    }

    return "Email Verified Sucessfully";
  }
}

export default AuthService;
