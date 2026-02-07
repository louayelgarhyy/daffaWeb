import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, SignupData } from '@/types/user';
import { authApi, getAuthToken, ApiError } from '@/lib/api';
import type { ApiUser } from '@/lib/api/types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string; verificationRequired?: boolean }>;
  verifyCode: (phone: string, code: string, countryId: number) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage keys
const AUTH_USER_KEY = 'auth_user';

// Map country dial code to country_id for the API
const COUNTRY_CODE_TO_ID: Record<string, number> = {
  '+974': 1,  // Qatar
  '+966': 2,  // Saudi Arabia
  '+971': 3,  // UAE
  '+965': 4,  // Kuwait
  '+973': 5,  // Bahrain
  '+968': 6,  // Oman
  '+962': 7,  // Jordan
  '+20': 8,   // Egypt
};

// Convert API user to app User type
const mapApiUserToUser = (apiUser: ApiUser, countryCode: string): User => ({
  id: String(apiUser.id),
  name: apiUser.name,
  phone: apiUser.phone,
  countryCode: countryCode,
  createdAt: apiUser.created_at,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedUser = localStorage.getItem(AUTH_USER_KEY);
        const storedToken = getAuthToken();

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        localStorage.removeItem(AUTH_USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const countryId = COUNTRY_CODE_TO_ID[credentials.countryCode] || 1;
      
      const response = await authApi.login({
        phone: credentials.phone,
        password: credentials.password,
        country_id: countryId,
      });

      const authenticatedUser = mapApiUserToUser(response.user, credentials.countryCode);
      
      setUser(authenticatedUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Signup function - Step 1: Register data
  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string; verificationRequired?: boolean }> => {
    try {
      const countryId = COUNTRY_CODE_TO_ID[data.countryCode] || 1;
      
      await authApi.registerData({
        name: data.name,
        phone: data.phone,
        password: data.password,
        country_id: countryId,
        type: 'user',
      });

      // Registration successful, verification code sent
      return { success: true, verificationRequired: true };
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof ApiError) {
        // Check for specific errors like phone already exists
        if (error.status === 422 || error.status === 409) {
          return { success: false, error: 'phoneExists' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Verify registration code - Step 2
  const verifyCode = async (phone: string, code: string, countryId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.registerCode({
        phone,
        code,
        country_id: countryId,
      });

      // Get the country code from ID (reverse lookup)
      const countryCode = Object.entries(COUNTRY_CODE_TO_ID).find(([, id]) => id === countryId)?.[0] || '+974';
      const authenticatedUser = mapApiUserToUser(response.user, countryCode);
      
      setUser(authenticatedUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));

      return { success: true };
    } catch (error) {
      console.error('Verification error:', error);
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Invalid verification code' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    authApi.logout();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    verifyCode,
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
