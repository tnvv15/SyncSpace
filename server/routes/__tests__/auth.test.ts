import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../index';
import { prisma } from '../../lib/db/client';
import { AUTH_COOKIE_NAME } from '../../lib/auth/jwt';

describe('Auth API Integration Tests (/api/auth)', () => {
  const testUser = {
    email: 'integration-test@syncspace.dev',
    password: 'SuperSecretPassword1!',
    name: 'SyncSpace Tester',
    avatarUrl: 'https://example.com/tester.png',
  };

  // Extract auth cookie helper
  const extractCookie = (res: request.Response): string | undefined => {
    const cookies = res.headers['set-cookie'];
    if (!cookies) return undefined;
    const cookieArr = Array.isArray(cookies) ? cookies : [cookies];
    return cookieArr.find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));
  };

  beforeAll(async () => {
    // Clean up test records before running tests
    await prisma.user.deleteMany({
      where: {
        email: { in: [testUser.email, 'another-user@syncspace.dev'] },
      },
    });
  });

  afterAll(async () => {
    // Clean up test records and disconnect Prisma
    await prisma.user.deleteMany({
      where: {
        email: { in: [testUser.email, 'another-user@syncspace.dev'] },
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new account, set an HttpOnly cookie, and omit passwordHash', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(testUser.email.toLowerCase());
      expect(res.body.name).toBe(testUser.name);
      expect(res.body.avatarUrl).toBe(testUser.avatarUrl);

      // Verify safety hygiene: passwordHash MUST NOT be exposed
      expect(res.body).not.toHaveProperty('passwordHash');

      // Verify Set-Cookie header contains HttpOnly auth_token
      const authCookie = extractCookie(res);
      expect(authCookie).toBeDefined();
      expect(authCookie).toContain('HttpOnly');
      expect(authCookie).toContain(`${AUTH_COOKIE_NAME}=`);
    });

    it('should return 409 Conflict when attempting duplicate registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already exists');
    });

    it('should return 400 Bad Request when validation fails', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          password: 'weak',
          name: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body).toHaveProperty('details');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully log in with valid credentials and set cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testUser.email.toLowerCase());
      expect(res.body).not.toHaveProperty('passwordHash');

      const authCookie = extractCookie(res);
      expect(authCookie).toBeDefined();
      expect(authCookie).toContain('HttpOnly');
    });

    it('should return 401 with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword999!',
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('should return 401 with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@syncspace.dev',
          password: 'SomePassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });
  });

  describe('GET /api/auth/me (Protected Route)', () => {
    it('should return 200 and user profile when accessing with valid auth cookie', async () => {
      // 1. Log in to acquire session cookie
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const authCookie = extractCookie(loginRes);
      expect(authCookie).toBeDefined();

      // 2. Request /me using the received cookie
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Cookie', authCookie!);

      expect(meRes.status).toBe(200);
      expect(meRes.body.email).toBe(testUser.email.toLowerCase());
      expect(meRes.body.name).toBe(testUser.name);
      expect(meRes.body).not.toHaveProperty('passwordHash');
    });

    it('should support Authorization Bearer token header fallback', async () => {
      // 1. Log in to get token from cookie
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const authCookie = extractCookie(loginRes)!;
      // Extract raw token value: auth_token=<token>; ...
      const token = authCookie.split(';')[0].split('=')[1];

      // 2. Request /me using Authorization Bearer header
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meRes.status).toBe(200);
      expect(meRes.body.email).toBe(testUser.email.toLowerCase());
    });

    it('should return 401 Unauthorized when accessing /me without cookie or token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Authentication required');
    });

    it('should return 401 Unauthorized with invalid or corrupted token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `${AUTH_COOKIE_NAME}=invalid.jwt.token`);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Authentication required');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return 200 and clear the auth cookie', async () => {
      const res = await request(app).post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');

      // Check that Set-Cookie expires or empties auth_token
      const cookie = extractCookie(res);
      expect(cookie).toBeDefined();
      // Cleared cookie typically sets empty value or expires in the past
      expect(cookie).toMatch(/auth_token=;?|auth_token=""/);
    });
  });
});
