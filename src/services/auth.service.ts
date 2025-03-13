import { CustomError } from "../errors/CustomError";
import { User } from "../models";
import { generateJwt, isValidEmail } from "../utils/helper";
import {
  hashPassword,
  verifyPassword,
  checkPasswordStrength,
} from "../utils/passwordHandler";

interface UserResponse {
  email: string;
  created_at: Date;
  token?: string | number;
}

class AuthService {
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
    const token = generateJwt(payload);

    return {
      email: user.email,
      created_at: user.created_at,
      token,
    };
  };
}

export default AuthService;
