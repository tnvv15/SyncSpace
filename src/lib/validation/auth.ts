import { z } from 'zod';

/**
 * Password strength rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 */
const UPPERCASE_REGEX = /[A-Z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

/**
 * Registration input validation schema (client-safe)
 */
export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email address format' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(UPPERCASE_REGEX, { message: 'Password must contain at least one uppercase letter' })
    .regex(NUMBER_REGEX, { message: 'Password must contain at least one number' })
    .regex(SPECIAL_CHAR_REGEX, { message: 'Password must contain at least one special character' }),
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters long' }),
  avatarUrl: z
    .string()
    .trim()
    .url({ message: 'Avatar URL must be a valid URL' })
    .optional()
    .nullable()
    .or(z.literal('')),
});

/**
 * Login input validation schema (client-safe)
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email address format' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

export type CreateUserInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
