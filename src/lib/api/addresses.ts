// Address API endpoints
import { get, post, put, del } from './client';
import type {
  ApiAddress,
  AddressesResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from './types';

/**
 * Get all addresses for authenticated user
 */
export async function getAddresses(): Promise<ApiAddress[]> {
  const response = await get<AddressesResponse>('/api/v2/daffa-addresses');
  return response.data;
}

/**
 * Get default address
 */
export async function getDefaultAddress(): Promise<ApiAddress | null> {
  try {
    const response = await get<{ data: ApiAddress }>('/api/v2/daffa-addresses/default');
    return response.data;
  } catch {
    return null;
  }
}

/**
 * Get single address by ID
 */
export async function getAddress(id: number): Promise<ApiAddress> {
  const response = await get<{ data: ApiAddress }>(`/api/v2/daffa-addresses/show/${id}`);
  return response.data;
}

/**
 * Create new address
 */
export async function createAddress(data: CreateAddressRequest): Promise<ApiAddress> {
  const response = await post<{ data: ApiAddress }>('/api/v2/daffa-addresses', data);
  return response.data;
}

/**
 * Update existing address
 */
export async function updateAddress(id: number, data: Partial<CreateAddressRequest>): Promise<ApiAddress> {
  const response = await put<{ data: ApiAddress }>(`/api/v2/daffa-addresses/${id}`, data);
  return response.data;
}

/**
 * Delete address
 */
export async function deleteAddress(id: number): Promise<void> {
  await del(`/api/v2/daffa-addresses/${id}`);
}

/**
 * Set address as default
 */
export async function setDefaultAddress(id: number): Promise<ApiAddress> {
  const response = await put<{ data: ApiAddress }>(`/api/v2/daffa-addresses/${id}/default`, {});
  return response.data;
}
