import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";
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

class AuthService {
  private readonly ACCESS_TOKEN_VALIDITY: string = "24h";
  private readonly REFRESH_TOKEN_VALIDITY: string = "7d";
  constructor() {}

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

    console.log(`ACCESS TOKEN REQUESTED`);

    return accessToken;
  }
}

export default AuthService;
