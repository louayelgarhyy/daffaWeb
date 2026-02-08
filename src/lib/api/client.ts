// API Client for Daffa Order System
const BASE_URL = 'https://appdaffah.com';

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';

// Get current language for API headers
const getLanguage = (): string => {
  return localStorage.getItem('i18nextLng') || 'ar';
};

// Get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

// Clear auth token
export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Default headers for all requests
const getHeaders = (includeAuth: boolean = true, method: string = 'GET'): HeadersInit => {
  const lang = getLanguage();
  const upperMethod = method.toUpperCase();
  const isReadMethod = upperMethod === 'GET' || upperMethod === 'HEAD';

  // NOTE:
  // - For public GET/HEAD requests, avoid custom headers and Content-Type.
  //   This prevents unnecessary CORS preflight requests on many backends.
  // - For write requests (POST/PUT/DELETE), we include Content-Type and any
  //   backend-specific headers.
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Accept-Language': lang,
  };

  if (!isReadMethod) {
    headers['Content-Type'] = 'application/json';
    headers['lang'] = lang;
    headers['currency'] = 'qar';
  }

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-Access-Token'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// API Error class
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const method = (options.method || 'GET').toString();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(includeAuth, method),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'An error occurred',
      response.status,
      data
    );
  }

  return data;
}

// GET request
export async function get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
  return fetchApi<T>(endpoint, { method: 'GET' }, includeAuth);
}

// POST request
export async function post<T>(endpoint: string, body?: unknown, includeAuth: boolean = true): Promise<T> {
  return fetchApi<T>(
    endpoint,
    {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    },
    includeAuth
  );
}

// PUT request
export async function put<T>(endpoint: string, body?: unknown, includeAuth: boolean = true): Promise<T> {
  return fetchApi<T>(
    endpoint,
    {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    },
    includeAuth
  );
}

// DELETE request
export async function del<T>(endpoint: string, body?: unknown, includeAuth: boolean = true): Promise<T> {
  return fetchApi<T>(
    endpoint,
    {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    },
    includeAuth
  );
}
