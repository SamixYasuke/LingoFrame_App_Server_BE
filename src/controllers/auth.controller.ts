import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import AuthService from "../services/auth.service";
import { createUserDto, loginUserDto } from "../dtos/user.dto";
import { CustomError } from "../errors/CustomError";
import { flattenZodErrors } from "../utils/helper";
import { AuthenticatedRequest } from "../types/express";

class AuthController {
  private readonly authService: AuthService;
  private readonly ACCESS_TOKEN_EXPIRY: number = 24 * 60 * 60 * 1000; // 86,400,000 ms (24 hours)
  private readonly REFRESH_TOKEN_EXPIRY: number = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms (7 days)
  // private readonly DOMAIN: string =
  //   process.env.NODE_ENV === "production"
  //     ? "lingoframe-landing-page.vercel.app"
  //     : "localhost";

  constructor() {
    this.authService = new AuthService();
  }

  public registerUser = asyncHandler(async (req: Request, res: Response) => {
    const validatedBody = createUserDto.safeParse(req.body);

    const terms_accepted_ip =
      req.headers["x-forwarded-for"]?.toString() ||
      req.socket.remoteAddress ||
      "unknown";

    if (!validatedBody.success) {
      const errorMessages = flattenZodErrors(validatedBody.error);
      throw new CustomError("Validation failed", 400, errorMessages);
    }

    const userData = {
      ...validatedBody.data,
      terms_accepted_ip,
    };

    const data = await this.authService.registerUserService(userData);
    const { access_token, refresh_token } = data.data;
    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.ACCESS_TOKEN_EXPIRY,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.REFRESH_TOKEN_EXPIRY,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(201).json({
      status_code: 201,
      message: "User Created Successfully",
    });
  });

  public loginUser = asyncHandler(async (req: Request, res: Response) => {
    const validatedLoginBody = loginUserDto.safeParse(req.body);

    const { data: validatedData, error: validationError } = validatedLoginBody;

    if (!validatedLoginBody.success) {
      const errorMessages = flattenZodErrors(validationError);
      throw new CustomError("Validation failed", 400, errorMessages);
    }

    const data = await this.authService.loginUserService(validatedData);
    const { access_token, refresh_token } = data.data;
    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.ACCESS_TOKEN_EXPIRY,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: this.REFRESH_TOKEN_EXPIRY,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({
      status_code: 200,
      message: "Login Successful",
    });
  });

  public logoutUser = asyncHandler(async (req: Request, res: Response) => {
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({
      status_code: 200,
      message: "Logout Successful",
    });
  });

  public getAccessToken = asyncHandler(async (req: Request, res: Response) => {
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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      status_code: 200,
      message: "New Access Token Generated",
    });
  });

  public requestEmailVerification = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      await this.authService.requestEmailVerification(user_id);
      res.status(200).json({
        status_code: 200,
        message: "Email Verification Link Sent To Your Email",
      });
    }
  );

  public verifyUserEmailController = asyncHandler(
    async (req: Request, res: Response) => {
      const { token } = req.query;
      const message = await this.authService.verifyUserEmail(token);
      res.status(200).json({
        status_code: 200,
        message,
      });
    }
  );
}

export default AuthController;
