import type { Request, Response, NextFunction } from 'express';
import { AUTH_COOKIE_NAME, verifyToken } from '../lib/auth/jwt';
import '../types/express.d';

/**
 * Authentication middleware that extracts JWT from HttpOnly cookie (or Bearer header)
 * and attaches the decoded payload to req.user.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  let token: string | undefined;

  // 1. Primary: Extract from HttpOnly cookie
  if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
    token = req.cookies[AUTH_COOKIE_NAME];
  }

  // 2. Fallback: Authorization: Bearer <token> header
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  req.user = payload;
  next();
}
