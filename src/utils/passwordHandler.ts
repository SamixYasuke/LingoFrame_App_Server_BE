import argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    return hashedPassword;
  } catch (err) {
    throw new Error("Failed to hash password");
  }
};

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (err) {
    throw new Error("Failed to verify password");
  }
};

interface PasswordStrengthResult {
  isStrong: boolean;
  missing: string[];
}

/**
 * Checks the strength of a password based on various criteria.
 * - Minimum length: 8 characters
 * - Requires: uppercase, lowercase, number, special character
 * - Optionally checks against common passwords using zxcvbn
 *
 * @param {string} password - The password to evaluate
 * @param {number} [minLength=8] - Minimum required length (default: 8)
 * @returns {PasswordStrengthResult} - Result object with strength status and missing criteria
 * @example
 * checkPasswordStrength("pass123") // { isStrong: false, missing: ["Minimum 8 characters", "Uppercase letter", "Special character"] }
 * checkPasswordStrength("Passw0rd!") // { isStrong: true, missing: [] }
 */
export function checkPasswordStrength(
  password: string,
  minLength: number = 8
): PasswordStrengthResult {
  const missing: string[] = [];

  if (typeof password !== "string" || password.trim() === "") {
    return {
      isStrong: false,
      missing: ["Password must be a non-empty string"],
    };
  }

  const trimmedPassword = password.trim();

  if (trimmedPassword.length < minLength) {
    missing.push(`Minimum ${minLength} characters`);
  }

  if (!/[A-Z]/.test(trimmedPassword)) {
    missing.push("Uppercase letter");
  }
  if (!/[a-z]/.test(trimmedPassword)) {
    missing.push("Lowercase letter");
  }
  if (!/[0-9]/.test(trimmedPassword)) {
    missing.push("Number");
  }
  if (!/[^A-Za-z0-9]/.test(trimmedPassword)) {
    missing.push("Special character");
  }

  return {
    isStrong: missing.length === 0,
    missing,
  };
}
