import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import AuthService from "../services/auth.service";
import { AuthenticatedRequest } from "../types/express";

class AuthController {
  private readonly authService: AuthService;
  private readonly ACCESS_TOKEN_EXPIRY: number = 24 * 60 * 60 * 1000; // 86,400,000 ms (24 hours)
  private readonly REFRESH_TOKEN_EXPIRY: number = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms (7 days)

  constructor() {
    this.authService = new AuthService();
  }

  public registerUser = asyncHandler(async (req: Request, res: Response) => {
    const {
      first_name,
      last_name,
      email,
      password,
      terms_accepted_at,
      terms_accepted_device,
    } = req.body;

    const terms_accepted_ip =
      req.headers["x-forwarded-for"]?.toString() ||
      req.socket.remoteAddress ||
      "unknown";

    const reqBodyData = {
      first_name,
      last_name,
      email,
      password,
      terms_accepted_at,
      terms_accepted_device,
      terms_accepted_ip,
    };

    const data = await this.authService.registerUserService(reqBodyData);
    const { access_token, refresh_token } = data.data;
    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.ACCESS_TOKEN_EXPIRY,
      sameSite: "none",
    });
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.REFRESH_TOKEN_EXPIRY,
      sameSite: "none",
    });
    res.status(201).json({
      status_code: 201,
      message: "User Created Successfully",
    });
  });

  public loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await this.authService.loginUserService(email, password);
    const { access_token, refresh_token } = data.data;
    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.ACCESS_TOKEN_EXPIRY,
      sameSite: "none",
    });
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.REFRESH_TOKEN_EXPIRY,
      sameSite: "none",
    });
    res.status(200).json({
      status_code: 200,
      message: "Login Successful",
    });
  });

  public logoutUser = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { accessToken } = req.cookies;
      if (!accessToken) {
        res.status(400).json({
          status_code: 400,
          message: "No active session found",
        });
        return;
      }
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
      res.status(200).json({
        status_code: 200,
        message: "Logout Successful",
      });
    }
  );

  public getAccessToken = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({
          status_code: 401,
          message: "No refresh token provided",
        });
      }

      const accessToken = await this.authService.getAccessTokenService(
        refreshToken
      );

      if (!accessToken) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
        });
        res.clearCookie("accessToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
        });
        return res.status(401).json({
          status_code: 401,
          message: "Invalid or expired refresh token",
        });
      }

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: this.ACCESS_TOKEN_EXPIRY,
        sameSite: "none",
      });

      return res.status(200).json({
        status_code: 200,
        message: "New Access Token Generated",
      });
    }
  );
}

export default AuthController;
