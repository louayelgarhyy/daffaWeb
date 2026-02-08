// Auth API endpoints
import { post, setAuthToken, clearAuthToken } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterDataRequest,
  RegisterDataResponse,
  RegisterCodeRequest,
  RegisterCodeResponse,
} from "./types";

// Helper to extract token from various response structures
function extractToken(response: unknown): string | null {
  if (!response || typeof response !== 'object') return null;
  
  const r = response as Record<string, unknown>;
  
  // Try: response.access_token, response.token, response.data.token, response.data.access_token
  if (typeof r.access_token === 'string') return r.access_token;
  if (typeof r.token === 'string') return r.token;
  
  if (r.data && typeof r.data === 'object') {
    const data = r.data as Record<string, unknown>;
    if (typeof data.access_token === 'string') return data.access_token;
    if (typeof data.token === 'string') return data.token;
  }
  
  return null;
}

/**
 * Login with phone and password
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await post<unknown>("/api/v2/user/login", data, false);
  
  const token = extractToken(response);
  if (token) {
    setAuthToken(token);
  }

  return response as LoginResponse;
}

/**
 * Register step 1: Submit user data
 */
export async function registerData(data: RegisterDataRequest): Promise<RegisterDataResponse> {
  return post<RegisterDataResponse>("/api/v2/user/register_data", data, false);
}

/**
 * Register step 2: Verify code and complete registration
 */
export async function registerCode(data: RegisterCodeRequest): Promise<RegisterCodeResponse> {
  const response = await post<unknown>("/api/v2/user/register_code", data, false);

  const token = extractToken(response);
  if (token) {
    setAuthToken(token);
  }

  return response as RegisterCodeResponse;
}

/**
 * Logout - clear local auth token
 */
export function logout(): void {
  clearAuthToken();
}
