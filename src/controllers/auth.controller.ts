import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import AuthService from "../services/auth.service";

class AuthController {
  private readonly authService: AuthService;
  private readonly SEVEN_DAYS_MS: number = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms (7 days)

  constructor() {
    this.authService = new AuthService();
  }

  registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await this.authService.registerUserService(email, password);
    const { token } = data;
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.SEVEN_DAYS_MS,
      sameSite: "none",
    });
    res.status(201).json({
      status_code: 201,
      message: "User Created Successfully",
      data,
    });
  });

  loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await this.authService.loginUserService(email, password);
    const { token } = data;
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.SEVEN_DAYS_MS,
      sameSite: "none",
    });
    res.status(201).json({
      status_code: 201,
      message: "Login Successful",
      data,
    });
  });
}

export default AuthController;
