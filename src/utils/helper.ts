import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { randomBytes } from "crypto";
import { VideoJob } from "../models";
import { ZodError } from "zod";
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
 * @param expireIn - Expiration time
 * @returns A signed JWT token.
 */
const generateJwt = (payload: object, expireIn: any): string => {
  if (!JWT_SECRET) {
    throw new CustomError(
      "JWT_SECRET is not defined in the environment variables.",
      500
    );
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expireIn });
};

/**
 * Verify the provided JWT token and decode its payload.
 * @param token - JWT token to verify.
 * @returns Decoded token payload if valid.
 * @throws CustomError if the token is invalid or expired.
 */
const verifyJwt = (
  token: string
): JwtPayload | { email: string; user_id: string } => {
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
 * The ID follows the format `JOB-YYYYMMDDHHMMSS-XXX`, where:
 * - `YYYYMMDDHHMMSS` is the current date and time in ISO format (year, month, day, hour, minute, second) without separators.
 * - `XXX` is a zero-padded, three-digit sequence number based on the count of jobs for that exact timestamp.
 * This ensures uniqueness within a second and readability for tracking purposes.
 *
 * @returns {Promise<string>} A promise that resolves to the generated job ID (e.g., "JOB-20250312142345-001").
 * @throws {Error} If the MongoDB query to count documents fails.
 */
const generateJobId = async (): Promise<string> => {
  const now = new Date();
  const dateTime = now
    .toISOString()
    .slice(0, 19) // YYYY-MM-DDTHH:mm:ss
    .replace(/[-:T]/g, ""); // Remove hyphens, colon, and T -> YYYYMMDDHHMMSS
  const count = await VideoJob.countDocuments({
    job_id: { $regex: `^JOB-${dateTime}` },
  });
  return `JOB-${dateTime}-${String(count + 1).padStart(3, "0")}`; // e.g., JOB-20250312142345-001
};

/**
 * Calculates the total credits required for subtitle processing based on video duration, subtitle type, and translation needs.
 *
 * Credits are calculated as follows:
 * - .SRT Generation: 1 credit per minute.
 * - Subtitle Merging (with mandatory customization, e.g., font, color, position): 3 credits per minute.
 * - Translation (optional, any non-English language): Adds +0.5 credits per minute to the base rate.
 *   - .SRT with translation: 1.5 credits/min.
 *   - Merging with translation: 3.5 credits/min.
 *
 * The result is rounded to two decimal places for precision. A minimum of 1 credit applies per task.
 *
 * @param input - The input data containing video duration, subtitle type, translation language, and customization options.
 * @returns The total number of credits required, rounded to two decimal places.
 *
 * @example
 * ```typescript
 * const input: CreditData = {
 *   durationMinutes: 10,
 *   subtitleType: "merge",
 *   translationLanguage: "Spanish",
 *   customizationOptions: { font: "Arial", color: "white" }
 * };
 * const credits = calculateCredits(input); // Returns 35.00 (10 * 3.5)
 *
 * const input2: CreditData = {
 *   durationMinutes: 7.5,
 *   subtitleType: "srt",
 *   translationLanguage: "",
 *   customizationOptions: { font: "Helvetica" }
 * };
 * const credits2 = calculateCredits(input2); // Returns 7.50 (7.5 * 1)
 *
 * const input3: CreditData = {
 *   durationMinutes: 0.5,
 *   subtitleType: "merge",
 *   translationLanguage: "",
 *   customizationOptions: { font: "Arial" }
 * };
 * const credits3 = calculateCredits(input3); // Returns 1.50 (0.5 * 3)
 * ```
 */
export interface CreditData {
  fileSizeMB?: number;
  durationMinutes: number;
  subtitleType: "srt" | "merge";
  translationLanguage: string;
  customizationOptions: { [key: string]: any };
}

const calculateCredits = (input: CreditData): number => {
  const { durationMinutes, subtitleType, translationLanguage } = input;

  if (durationMinutes <= 0) {
    return 0;
  }

  if (!["srt", "merge"].includes(subtitleType)) {
    throw new CustomError(
      "Invalid subtitleType: must be 'srt' or 'merge'",
      400
    );
  }

  const baseCreditsPerMinute = subtitleType === "srt" ? 1.0 : 3.0;

  const translationCredits =
    translationLanguage && translationLanguage.trim() !== "" ? 0.5 : 0.0;

  const creditsPerMinute = baseCreditsPerMinute + translationCredits;

  let totalCredits = durationMinutes * creditsPerMinute;

  totalCredits = Math.max(totalCredits, 1.0);

  return Number(totalCredits.toFixed(2));
};

const flattenZodErrors = (error: ZodError): string[] => {
  const recurse = (obj: any): string[] => {
    if (!obj || typeof obj !== "object") return [];

    // Collect errors at the current level
    const errors: string[] = obj._errors ? obj._errors : [];

    // Recurse into nested fields, excluding '_errors'
    return Object.entries(obj)
      .filter(([key]) => key !== "_errors")
      .flatMap(([_, value]) => recurse(value))
      .concat(errors);
  };

  return recurse(error.format()).filter(Boolean);
};

export {
  generateOtp,
  generateJwt,
  verifyJwt,
  isValidEmail,
  calculateOtpExpiry,
  generateJobId,
  calculateCredits,
  flattenZodErrors,
};
