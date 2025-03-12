import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { randomBytes } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

/**
 * Generate a 6-character OTP.
 * @returns A random OTP as a string.
 */
const generateOtp = (): string => {
  return randomBytes(3).toString("hex");
};

/**
 * Generate a JWT token with the provided payload.
 * @param payload - Data to encode in the JWT (e.g., { id, email }).
 * @returns A signed JWT token.
 */
const generateJwt = (payload: object): string => {
  if (!JWT_SECRET) {
    throw new CustomError(
      "JWT_SECRET is not defined in the environment variables.",
      500
    );
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

/**
 * Verify the provided JWT token and decode its payload.
 * @param token - JWT token to verify.
 * @returns Decoded token payload if valid.
 * @throws CustomError if the token is invalid or expired.
 */
const verifyJwt = (token: string): JwtPayload | null => {
  try {
    if (!JWT_SECRET) {
      throw new CustomError(
        "JWT_SECRET is not defined in the environment variables.",
        500
      );
    }
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new CustomError("Token has expired.", 401);
    } else if (error.name === "JsonWebTokenError") {
      throw new CustomError("Invalid token.", 401);
    }
    throw new CustomError("Token verification failed.", 500);
  }
};

/**
 * Verifies if the provided email is a valid work email.
 * @param email - The email to verify.
 * @returns boolean - Returns true if it's a valid work email, otherwise false.
 */
const isValidWorkEmail = (email: string): boolean => {
  const workEmailPattern =
    /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?veritas\.edu\.ng$/;
  return workEmailPattern.test(email);
};

/**
 * Calculates the expiry date for an OTP based on the current time and the provided duration.
 *
 * @param {number} minutes - The duration in minutes for which the OTP should be valid.
 * @returns {Date} The calculated expiry date and time.
 *
 * @example
 * // Returns a Date object 10 minutes from now
 * const expiry = calculateOtpExpiry(10);
 */
const calculateOtpExpiry = (minutes: number): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

export {
  generateOtp,
  generateJwt,
  verifyJwt,
  isValidWorkEmail,
  calculateOtpExpiry,
};
