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
 * Maps frontend field names to backend expected names
 */
export async function createAddress(data: CreateAddressRequest): Promise<ApiAddress> {
  // Backend expects: name, phone, street, city_id, region, postal_code, country, is_default, title
  const payload: Record<string, unknown> = {
    title: data.title || 'Home',
    name: data.full_name || '',
    phone: data.phone || '',
    street: data.address_line_1 || '',
    city_id: 1, // Required by backend - default city ID
    city: data.city || '',
    region: data.region || '',
    postal_code: data.postal_code || '',
    country: data.country || 'QA',
    is_default: data.is_default ? 1 : 0,
  };
  // Only include optional fields if they have values
  if (data.address_line_2) payload.address_line_2 = data.address_line_2;
  if (data.latitude) payload.latitude = data.latitude;
  if (data.longitude) payload.longitude = data.longitude;
  
  const response = await post<{ data: ApiAddress }>('/api/v2/daffa-addresses', payload);
  return response.data;
}

/**
 * Update existing address
 */
export async function updateAddress(id: number, data: Partial<CreateAddressRequest>): Promise<ApiAddress> {
  // Map frontend fields to backend expected names
  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.full_name !== undefined) payload.name = data.full_name;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.address_line_1 !== undefined) payload.street = data.address_line_1;
  if (data.address_line_2 !== undefined) payload.address_line_2 = data.address_line_2;
  if (data.city !== undefined) { payload.city_id = data.city; payload.city = data.city; }
  if (data.region !== undefined) payload.region = data.region;
  if (data.postal_code !== undefined) payload.postal_code = data.postal_code;
  if (data.country !== undefined) payload.country = data.country;
  if (data.is_default !== undefined) payload.is_default = data.is_default;
  
  const response = await put<{ data: ApiAddress }>(`/api/v2/daffa-addresses/${id}`, payload);
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
