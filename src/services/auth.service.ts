import { CustomError } from "../errors/CustomError";
import { User } from "../models";
import { generateJwt, isValidEmail, verifyJwt } from "../utils/helper";
import {
  hashPassword,
  verifyPassword,
  checkPasswordStrength,
} from "../utils/passwordHandler";

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
  constructor() {}

  public registerUserService = async (
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

    return accessToken;
  }
}

export default AuthService;
