import type { CreateUserInput, LoginInput } from '../validation/auth';
import type { SafeUser } from '../../types/auth';

/**
 * Parses response JSON and throws an informative error if response is not ok.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = 'An unexpected error occurred';
    try {
      const data = await res.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

/**
 * Registers a new user account with credentials: 'include' so session cookie is saved.
 */
export async function registerApi(data: CreateUserInput): Promise<SafeUser> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<SafeUser>(res);
}

/**
 * Logs in with email and password, setting the session cookie.
 */
export async function loginApi(data: LoginInput): Promise<SafeUser> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<SafeUser>(res);
}

/**
 * Logs out the current session and clears the auth cookie.
 */
export async function logoutApi(): Promise<void> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to logout');
  }
}

/**
 * Fetches the currently authenticated user from the backend.
 * Catches 401 and network errors gracefully and returns null without unhandled rejections.
 */
export async function getCurrentUserApi(): Promise<SafeUser | null> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });
    if (res.status === 401 || res.status === 404) {
      return null;
    }
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}
