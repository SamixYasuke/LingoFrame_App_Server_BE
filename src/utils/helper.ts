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

export interface CreditData {
  fileSizeMB: number;
  durationMinutes: number;
  subtitleType: "srt" | "merge";
  translationLanguage: string;
  customizationOptions?: object;
}

/**
 * Calculates the total credits required for subtitle processing based on video duration,
 * subtitle type, translation needs, and customization options.
 *
 * Credits are calculated as follows:
 * - SRT generation: 1.5 credits per minute
 * - Subtitle merging: 2 credits per minute (if "merge" is selected)
 * - Translation: 2 credits per minute (if a translation language is provided)
 * - Customization: 0.5 credits per minute (if "merge" is selected and customization options are provided)
 *
 * The result is rounded to two decimal places.
 *
 * @param input - The input data containing video duration, subtitle type, translation language, and customization options.
 * @returns The total number of credits required.
 *
 * @example
 * ```typescript
 * const input: CreditData = {
 *   fileSizeMB: 100,
 *   durationMinutes: 10,
 *   subtitleType: "merge",
 *   translationLanguage: "Spanish",
 *   customizationOptions: { font: "Arial" }
 * };
 * const credits = calculateCredits(input); // Returns 45.00
 * ```
 */
const calculateCredits = (input: CreditData): number => {
  const {
    durationMinutes,
    subtitleType,
    translationLanguage,
    customizationOptions,
  } = input;

  // Generate SRT: 1.5 credits per minute
  const srtCredits = durationMinutes * 1.5;

  // Burn subtitles into video ("merge"): 2 credits per minute
  const mergeCredits = subtitleType === "merge" ? durationMinutes * 2 : 0;

  // Translation: 2 credits per minute if translationLanguage is provided
  const translationCredits = translationLanguage ? durationMinutes * 2 : 0;

  // Customization: 0.5 credits per minute if merge and non-empty customizationOptions
  const isCustomizationNonEmpty =
    subtitleType === "merge" &&
    customizationOptions !== undefined &&
    customizationOptions !== null &&
    Object.keys(customizationOptions).length > 0;
  const customizationCredits = isCustomizationNonEmpty
    ? durationMinutes * 0.5
    : 0;

  // Total credits
  const totalCredits =
    srtCredits + mergeCredits + translationCredits + customizationCredits;

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
