// Auth API endpoints
import { post, setAuthToken, clearAuthToken } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterDataRequest,
  RegisterDataResponse,
  RegisterCodeRequest,
  RegisterCodeResponse,
} from './types';

/**
 * Login with phone and password
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await post<LoginResponse>('/api/user/login', data, false);
  
  if (response.access_token) {
    setAuthToken(response.access_token);
  }
  
  return response;
}

/**
 * Register step 1: Submit user data
 */
export async function registerData(data: RegisterDataRequest): Promise<RegisterDataResponse> {
  return post<RegisterDataResponse>('/api/user/register_data', data, false);
}

/**
 * Register step 2: Verify code and complete registration
 */
export async function registerCode(data: RegisterCodeRequest): Promise<RegisterCodeResponse> {
  const response = await post<RegisterCodeResponse>('/api/user/register_code', data, false);
  
  if (response.access_token) {
    setAuthToken(response.access_token);
  }
  
  return response;
}

/**
 * Logout - clear local auth token
 */
export function logout(): void {
  clearAuthToken();
}
