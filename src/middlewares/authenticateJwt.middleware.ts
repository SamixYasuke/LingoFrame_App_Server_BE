import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyJwt } from "../utils/helper";
import { CustomError } from "../errors/CustomError";

export interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    email?: string;
    role: string;
  };
}

export const authenticateJwt = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Unauthorized: Token is missing", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token);

    if (!decoded || typeof decoded !== "object") {
      throw new CustomError("Unauthorized: Invalid token", 401);
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  }
);
