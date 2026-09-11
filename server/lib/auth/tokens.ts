import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY_MINUTES = 30; // 30 minutes
const RESET_TOKEN_LENGTH = 32; // 32 bytes = 256 bits

/**
 * Generates a cryptographically secure random reset token.
 * Returns the raw token (to be sent to user) and its hash (to be stored in database).
 */
export function generateResetToken(): { token: string; tokenHash: string } {
  const token = crypto.randomBytes(RESET_TOKEN_LENGTH).toString('hex');
  const tokenHash = bcrypt.hashSync(token, DEFAULT_SALT_ROUNDS);
  return { token, tokenHash };
}

/**
 * Verifies a reset token against a stored hash.
 */
export async function verifyResetToken(token: string, tokenHash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(token, tokenHash);
  } catch {
    return false;
  }
}

/**
 * Calculates the expiration date for a reset token.
 */
export function calculateResetTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + RESET_TOKEN_EXPIRY_MINUTES);
  return expiry;
}

/**
 * Checks if a reset token has expired.
 */
export function isResetTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}