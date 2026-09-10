import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../password';
import { registerSchema, loginSchema } from '../../../../src/lib/validation/auth';
import { toSafeUser, User } from '../../../../src/types/auth';

describe('Password Security Utilities', () => {
  const samplePassword = 'SuperSecretPassword!123';

  it('should securely hash a plaintext password', async () => {
    const hash = await hashPassword(samplePassword);

    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    // Bcrypt hashes start with $2a$ or $2b$
    expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
    expect(hash).not.toEqual(samplePassword);
  });

  it('should generate unique salts for identical passwords', async () => {
    const hash1 = await hashPassword(samplePassword);
    const hash2 = await hashPassword(samplePassword);

    expect(hash1).not.toEqual(hash2);
  });

  it('should enforce at least 10 salt rounds even if fewer are requested', async () => {
    // Bcrypt encodes the round count in characters 4-5 (e.g., $2a$10$ or $2b$12$)
    const hash = await hashPassword(samplePassword, 4);
    const roundStr = hash.split('$')[2];
    const rounds = parseInt(roundStr, 10);
    expect(rounds).toBeGreaterThanOrEqual(10);
  });

  it('should reject hashing empty password strings', async () => {
    await expect(hashPassword('')).rejects.toThrow('Password must not be empty');
  });

  it('should verify a correct password against its hash', async () => {
    const hash = await hashPassword(samplePassword);
    const isValid = await verifyPassword(samplePassword, hash);

    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password against a hash', async () => {
    const hash = await hashPassword(samplePassword);
    const isValid = await verifyPassword('WrongPassword#999', hash);

    expect(isValid).toBe(false);
  });

  it('should handle empty password or invalid hash safely without crashing', async () => {
    const isValidEmptyPass = await verifyPassword('', '$2b$12$somevalidlengthmockhashstring');
    const isValidEmptyHash = await verifyPassword(samplePassword, '');
    const isValidCorrupted = await verifyPassword(samplePassword, 'not-a-bcrypt-hash');

    expect(isValidEmptyPass).toBe(false);
    expect(isValidEmptyHash).toBe(false);
    expect(isValidCorrupted).toBe(false);
  });
});

describe('User Registration Validation Schema (Zod)', () => {
  const validUserPayload = {
    email: 'test@example.com',
    password: 'SecurePassword1!',
    name: 'Jane Doe',
    avatarUrl: 'https://example.com/avatar.png',
  };

  it('should validate a correct registration payload and normalize email', () => {
    const parsed = registerSchema.parse({
      ...validUserPayload,
      email: '  TEST@EXAMPLE.COM  ',
      name: '  Jane Doe  ',
    });

    expect(parsed.email).toBe('test@example.com');
    expect(parsed.name).toBe('Jane Doe');
    expect(parsed.password).toBe('SecurePassword1!');
    expect(parsed.avatarUrl).toBe('https://example.com/avatar.png');
  });

  it('should accept registration without avatarUrl', () => {
    const { avatarUrl: _, ...noAvatar } = validUserPayload;
    const parsed = registerSchema.parse(noAvatar);
    expect(parsed.email).toBe('test@example.com');
  });

  it('should reject invalid email formats', () => {
    const invalidEmails = ['invalid-email', '@no-local.com', 'no-domain@', 'spaces in@email.com'];

    for (const email of invalidEmails) {
      const result = registerSchema.safeParse({ ...validUserPayload, email });
      expect(result.success).toBe(false);
    }
  });

  it('should reject passwords shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validUserPayload,
      password: 'Aa1!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message.includes('8 characters'))).toBe(true);
    }
  });

  it('should reject passwords missing an uppercase letter', () => {
    const result = registerSchema.safeParse({
      ...validUserPayload,
      password: 'password123!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message.includes('uppercase'))).toBe(true);
    }
  });

  it('should reject passwords missing a number', () => {
    const result = registerSchema.safeParse({
      ...validUserPayload,
      password: 'PasswordSpecial!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message.includes('number'))).toBe(true);
    }
  });

  it('should reject passwords missing a special character', () => {
    const result = registerSchema.safeParse({
      ...validUserPayload,
      password: 'PasswordNumber123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message.includes('special character'))).toBe(true);
    }
  });

  it('should reject names shorter than 2 characters or blank when trimmed', () => {
    const result1 = registerSchema.safeParse({
      ...validUserPayload,
      name: 'A',
    });
    const result2 = registerSchema.safeParse({
      ...validUserPayload,
      name: '   ',
    });

    expect(result1.success).toBe(false);
    expect(result2.success).toBe(false);
  });

  it('should reject invalid avatar URL format', () => {
    const result = registerSchema.safeParse({
      ...validUserPayload,
      avatarUrl: 'not-a-valid-url',
    });

    expect(result.success).toBe(false);
  });
});

describe('User Login Validation Schema (Zod)', () => {
  it('should validate valid login payload', () => {
    const parsed = loginSchema.parse({
      email: '  user@example.com ',
      password: 'MyPassword1!',
    });

    expect(parsed.email).toBe('user@example.com');
    expect(parsed.password).toBe('MyPassword1!');
  });

  it('should reject empty password in login', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });

    expect(result.success).toBe(false);
  });
});

describe('Safety & Code Hygiene (toSafeUser)', () => {
  it('should strictly strip passwordHash from client-facing user objects', () => {
    const user: User = {
      id: 'd9b2d63d-a23c-4991-88f5-3cbf1e7a4b01',
      email: 'alex@syncspace.dev',
      passwordHash: '$2b$12$eX4mp13h4shv4lu3th4tsh0u1dn3v3rb3134k3d',
      name: 'Alex Rivera',
      avatarUrl: 'https://example.com/alex.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const safe = toSafeUser(user);

    expect(safe.id).toBe(user.id);
    expect(safe.email).toBe(user.email);
    expect(safe.name).toBe(user.name);
    expect(safe.avatarUrl).toBe(user.avatarUrl);
    expect(safe.createdAt).toBe(user.createdAt);
    expect(safe.updatedAt).toBe(user.updatedAt);

    // Verify passwordHash is not present
    expect('passwordHash' in safe).toBe(false);
    expect(Object.keys(safe)).not.toContain('passwordHash');
    expect((safe as unknown as Record<string, unknown>).passwordHash).toBeUndefined();
  });
});
