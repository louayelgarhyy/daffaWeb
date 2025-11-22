export interface User {
  id: string;
  name: string;
  phone: string;
  countryCode: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  countryCode: string;
  phone: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  countryCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
