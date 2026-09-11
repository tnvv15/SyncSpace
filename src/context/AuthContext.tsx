import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SafeUser } from '../types/auth';
import type { CreateUserInput, LoginInput } from '../lib/validation/auth';
import { getCurrentUserApi, loginApi, registerApi, logoutApi } from '../lib/api/auth';

export interface AuthContextType {
  user: SafeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput | string, legacyPassword?: string) => Promise<void>;
  register: (data: CreateUserInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Rehydrate session on mount
  useEffect(() => {
    let isMounted = true;

    async function rehydrate() {
      try {
        const currentUser = await getCurrentUserApi();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Session rehydration failed:', err);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    rehydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (data: LoginInput | string, legacyPassword?: string): Promise<void> => {
    const credentials: LoginInput =
      typeof data === 'string'
        ? { email: data, password: legacyPassword || '' }
        : data;

    const loggedInUser = await loginApi(credentials);
    setUser(loggedInUser);
  };

  const register = async (data: CreateUserInput): Promise<void> => {
    const registeredUser = await registerApi(data);
    setUser(registeredUser);
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
