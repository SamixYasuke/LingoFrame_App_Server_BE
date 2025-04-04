import { CustomError } from "../errors/CustomError";
import { User } from "../models";
import { generateJwt, isValidEmail, verifyJwt } from "../utils/helper";
import { checkPasswordStrength } from "../utils/passwordHandler";

interface UserResponse {
  email?: string;
  data?: {
    access_token: string;
    refresh_token: string;
  };
  created_at?: Date;
}

interface UserRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  terms_accepted_at: Date;
  terms_accepted_device: string;
  terms_accepted_ip: string;
}

class AuthService {
  private readonly ACCESS_TOKEN_VALIDITY: string = "24h";
  private readonly REFRESH_TOKEN_VALIDITY: string = "7d";
  constructor() {}

  public registerUserService = async (
    reqBodyData: UserRegisterPayload
  ): Promise<UserResponse> => {
    const {
      email,
      first_name,
      last_name,
      password,
      terms_accepted_at,
      terms_accepted_device,
      terms_accepted_ip,
    } = reqBodyData;

    if (!email || !password || !first_name || !last_name) {
      throw new CustomError(
        "First name, last name, email, and password are required",
        400
      );
    }

    if (!terms_accepted_at) {
      throw new CustomError("Terms acceptance data is required", 400);
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

    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      terms_accepted_at: new Date(terms_accepted_at),
      terms_accepted_device,
      terms_accepted_ip,
      credits: 10,
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

    return accessToken;
  }
}

export default AuthService;
