import bcrypt from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 12;

/**
 * Hashes a plain-text password securely using bcrypt with at least 10-12 salt rounds.
 *
 * @param plainText Plain-text password to hash
 * @param saltRounds Number of salt rounds (defaults to 12, minimum 10 enforced)
 * @returns Promise resolving to the resulting bcrypt hash string
 */
export async function hashPassword(
  plainText: string,
  saltRounds: number = DEFAULT_SALT_ROUNDS
): Promise<string> {
  if (!plainText) {
    throw new Error('Password must not be empty');
  }

  const rounds = Math.max(10, saltRounds);
  return bcrypt.hash(plainText, rounds);
}

/**
 * Safely compares a candidate plain-text password against a stored bcrypt hash.
 *
 * @param plainText Candidate plain-text password
 * @param hash Stored bcrypt hash
 * @returns Promise resolving to true if password matches, false otherwise
 */
export async function verifyPassword(
  plainText: string,
  hash: string
): Promise<boolean> {
  if (!plainText || !hash) {
    return false;
  }

  try {
    return await bcrypt.compare(plainText, hash);
  } catch {
    return false;
  }
}
