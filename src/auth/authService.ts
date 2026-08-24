export interface User {
  email: string;
  name: string;
  avatarUrl?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Hardcoded demo user validation
    if (email === 'tanvi@syncspace.dev' && password === 'syncspace123') {
      const user: User = {
        email: 'tanvi@syncspace.dev',
        name: 'Tanvi',
        avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Tanvi&backgroundColor=c0aede'
      };
      
      localStorage.setItem('syncspace_auth_session', JSON.stringify({
        isAuthenticated: true,
        user
      }));
      
      return user;
    }

    throw new Error('Invalid email or password.');
  },

  logout(): void {
    localStorage.removeItem('syncspace_auth_session');
  },

  getSession(): { isAuthenticated: boolean; user: User | null } {
    try {
      const sessionData = localStorage.getItem('syncspace_auth_session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed && parsed.isAuthenticated && parsed.user) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse auth session', e);
    }
    return { isAuthenticated: false, user: null };
  }
};
