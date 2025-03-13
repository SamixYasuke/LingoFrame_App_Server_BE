import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import AuthService from "../services/auth.service";

class AuthController {
  private readonly authService: AuthService;
  private readonly SEVEN_DAYS_MS: number = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms (7 days)

  constructor() {
    this.authService = new AuthService();
  }

  public registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await this.authService.registerUserService(email, password);
    const { token } = data;
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.SEVEN_DAYS_MS,
      sameSite: "lax",
    });
    res.status(201).json({
      status_code: 201,
      message: "User Created Successfully",
      data,
    });
  });

  public loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await this.authService.loginUserService(email, password);
    const { token } = data;
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.SEVEN_DAYS_MS,
      sameSite: "lax",
    });
    res.status(200).json({
      status_code: 200,
      message: "Login Successful",
      data,
    });
  });

  logOutUser = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(400).json({
        status_code: 400,
        message: "No active session found",
      });
      return;
    }
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({
      status_code: 200,
      message: "Logout Successful",
    });
  });
}

export default AuthController;
