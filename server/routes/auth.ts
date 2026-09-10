import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../lib/db/client';
import { hashPassword, verifyPassword } from '../lib/auth/password';
import { signToken, setAuthCookie, clearAuthCookie } from '../lib/auth/jwt';
import { requireAuth } from '../middleware/auth';
import { registerSchema, loginSchema } from '../../src/lib/validation/auth';
import { toSafeUser } from '../../src/types/auth';

const router = Router();

/**
 * POST /api/auth/register
 * Validates registration input, checks duplicates, creates user, sets auth cookie, and returns safe user.
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.issues,
      });
      return;
    }

    const { email, password, name, avatarUrl } = parseResult.data;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'User already exists with this email' });
      return;
    }

    // Hash password and persist user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        avatarUrl: avatarUrl || null,
      },
    });

    // Generate JWT and set HttpOnly session cookie
    const token = signToken({ userId: user.id, email: user.email });
    setAuthCookie(res, token);

    res.status(201).json(toSafeUser(user));
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 * Validates credentials, sets session cookie, and returns safe user.
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.issues,
      });
      return;
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email });
    setAuthCookie(res, token);

    res.status(200).json(toSafeUser(user));
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 * Clears the auth cookie.
 */
router.post('/logout', (_req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Returns authenticated user profile, guarded by requireAuth middleware.
 */
router.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(toSafeUser(user));
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
export { router as authRouter };
