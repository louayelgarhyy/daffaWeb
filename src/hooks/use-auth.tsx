import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, SignupData } from '@/types/user';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage keys
const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKEN_KEY = 'auth_token';
const USERS_DB_KEY = 'users_db';

// Mock user database structure
interface MockUser {
  id: string;
  name: string;
  phone: string;
  countryCode: string;
  password: string; // In real app, this would be hashed
  createdAt: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedUser = localStorage.getItem(AUTH_USER_KEY);
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        // Clear corrupted data
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Get mock users database
  const getUsersDB = (): MockUser[] => {
    try {
      const usersJson = localStorage.getItem(USERS_DB_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch {
      return [];
    }
  };

  // Save users database
  const saveUsersDB = (users: MockUser[]) => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const users = getUsersDB();
      const fullPhone = `${credentials.countryCode}${credentials.phone}`;

      // Find user with matching phone
      const mockUser = users.find(
        u => `${u.countryCode}${u.phone}` === fullPhone
      );

      // Validate credentials
      if (!mockUser || mockUser.password !== credentials.password) {
        return false;
      }

      // Create user object (without password)
      const authenticatedUser: User = {
        id: mockUser.id,
        name: mockUser.name,
        phone: mockUser.phone,
        countryCode: mockUser.countryCode,
        createdAt: mockUser.createdAt,
      };

      // Generate mock token
      const mockToken = `mock_token_${Date.now()}`;

      // Save to state and localStorage
      setUser(authenticatedUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Signup function
  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      const users = getUsersDB();
      const fullPhone = `${data.countryCode}${data.phone}`;

      // Check if user already exists
      const existingUser = users.find(
        u => `${u.countryCode}${u.phone}` === fullPhone
      );

      if (existingUser) {
        return false;
      }

      // Create new user
      const newMockUser: MockUser = {
        id: `user_${Date.now()}`,
        name: data.name,
        phone: data.phone,
        countryCode: data.countryCode,
        password: data.password, // In real app, would be hashed
        createdAt: new Date().toISOString(),
      };

      // Save to database
      users.push(newMockUser);
      saveUsersDB(users);

      // Auto-login the new user
      const authenticatedUser: User = {
        id: newMockUser.id,
        name: newMockUser.name,
        phone: newMockUser.phone,
        countryCode: newMockUser.countryCode,
        createdAt: newMockUser.createdAt,
      };

      const mockToken = `mock_token_${Date.now()}`;

      setUser(authenticatedUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
