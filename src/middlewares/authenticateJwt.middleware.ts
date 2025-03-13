import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyJwt } from "../utils/helper";
import { CustomError } from "../errors/CustomError";
import { AuthenticatedRequest } from "../types/express";

export const authenticateJwt = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const cookieJwt = req.cookies.jwt;

    if (!cookieJwt) {
      throw new CustomError("Unauthorized: Token is missing", 401);
    }

    const decoded = verifyJwt(cookieJwt);

    if (!decoded || typeof decoded !== "object") {
      throw new CustomError("Unauthorized: Invalid token", 401);
    }

    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
    };
    next();
  }
);
