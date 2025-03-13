import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { randomBytes } from "crypto";
import { VideoJob } from "../models";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
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
 * Validates whether a given string is a valid email address.
 * Uses a regular expression to check for basic email format compliance.
 * Note: This is not a full RFC 5322 validation, but suitable for most practical use cases.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 * @example
 * isValidEmail("user@example.com") // true
 * isValidEmail("invalid-email") // false
 */
const isValidEmail = (email: string): boolean => {
  if (typeof email !== "string" || email.trim() === "") {
    return false;
  }

  // Regular expression for basic email validation
  // - Allows: letters, numbers, dots, hyphens, underscores
  // - Requires: @symbol, domain with at least one dot
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email.trim());
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

/**
 * Generates a unique job ID for video processing tasks.
 * The ID follows the format `JOB-YYYYMMDD-XXX`, where:
 * - `YYYYMMDD` is the current date in ISO format without hyphens.
 * - `XXX` is a zero-padded, three-digit sequence number based on the count of jobs for that date.
 * This ensures uniqueness within a day and readability for tracking purposes.
 *
 * @returns {Promise<string>} A promise that resolves to the generated job ID (e.g., "JOB-20250312-001").
 * @throws {Error} If the MongoDB query to count documents fails.
 */
const generateJobId = async (): Promise<string> => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const count = await VideoJob.countDocuments({
    job_id: { $regex: `^JOB-${date}` },
  });
  return `JOB-${date}-${String(count + 1).padStart(3, "0")}`; // e.g., JOB-20250312-001
};

export {
  generateOtp,
  generateJwt,
  verifyJwt,
  isValidEmail,
  calculateOtpExpiry,
  generateJobId,
};
