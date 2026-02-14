// Address API endpoints
import { get, post, put, del } from './client';
import type {
  ApiAddress,
  CreateAddressRequest,
  UpdateAddressRequest,
} from './types';

// Raw API response types (different from our frontend ApiAddress)
interface RawApiCity {
  id: string | number;
  name: string;
  code?: string;
  country_id?: number;
}

interface RawApiAddress {
  id: string | number;
  name: string;
  phone?: string;
  city?: RawApiCity;
  area?: { id: string | number; name: string } | null;
  street?: string;
  building?: string;
  address_type?: string;
  title?: string;
  is_default: boolean | number;
  full_address?: string;
  postal_code?: string;
  country?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Map raw backend address response to our frontend ApiAddress type
 */
function mapRawToApiAddress(raw: RawApiAddress): ApiAddress {
  return {
    id: typeof raw.id === 'string' ? parseInt(raw.id) : raw.id,
    title: raw.title || raw.address_type || 'Address',
    full_name: raw.name || '',
    phone: raw.phone || '',
    address_line_1: raw.street || '',
    address_line_2: raw.building || '',
    city: typeof raw.city === 'object' && raw.city ? raw.city.name : (raw.city as unknown as string) || '',
    region: raw.area?.name || raw.region || '',
    postal_code: raw.postal_code || '',
    country: raw.country || 'QA',
    is_default: raw.is_default === true || raw.is_default === 1,
    latitude: raw.latitude,
    longitude: raw.longitude,
    created_at: raw.created_at || '',
    updated_at: raw.updated_at || '',
  };
}

/**
 * Get all addresses for authenticated user
 */
export async function getAddresses(): Promise<ApiAddress[]> {
  const response = await get<{ data: RawApiAddress[]; success?: boolean }>('/api/v2/daffa-addresses');
  const rawAddresses = response.data || [];
  return rawAddresses.map(mapRawToApiAddress);
}

/**
 * Get default address
 */
export async function getDefaultAddress(): Promise<ApiAddress | null> {
  try {
    const response = await get<{ data: RawApiAddress }>('/api/v2/daffa-addresses/default');
    return response.data ? mapRawToApiAddress(response.data) : null;
  } catch {
    return null;
  }
}

/**
 * Get single address by ID
 */
export async function getAddress(id: number): Promise<ApiAddress> {
  const response = await get<{ data: RawApiAddress }>(`/api/v2/daffa-addresses/show/${id}`);
  return mapRawToApiAddress(response.data);
}

/**
 * Create new address
 * Maps frontend field names to backend expected names
 */
export async function createAddress(data: CreateAddressRequest): Promise<ApiAddress> {
  const payload: Record<string, unknown> = {
    title: data.title || 'Home',
    name: data.full_name || '',
    phone: data.phone || '',
    street: data.address_line_1 || '',
    city_id: data.city_id ? Number(data.city_id) : 1,
    area_id: data.area_id ? Number(data.area_id) : undefined,
    city: data.city || '',
    region: data.region || '',
    postal_code: data.postal_code || '',
    country: data.country || 'QA',
    is_default: data.is_default ? 1 : 0,
  };
  if (data.address_line_2) payload.building = data.address_line_2;
  if (data.latitude) payload.latitude = data.latitude;
  if (data.longitude) payload.longitude = data.longitude;
  
  const response = await post<{ data: RawApiAddress }>('/api/v2/daffa-addresses', payload);
  return mapRawToApiAddress(response.data);
}

/**
 * Update existing address
 */
export async function updateAddress(id: number, data: Partial<CreateAddressRequest>): Promise<ApiAddress> {
  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.full_name !== undefined) payload.name = data.full_name;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.address_line_1 !== undefined) payload.street = data.address_line_1;
  if (data.address_line_2 !== undefined) payload.building = data.address_line_2;
  if (data.city !== undefined) payload.city = data.city;
  if (data.city_id !== undefined) payload.city_id = Number(data.city_id);
  if (data.region !== undefined) payload.region = data.region;
  if (data.area_id !== undefined) payload.area_id = Number(data.area_id);
  if (data.postal_code !== undefined) payload.postal_code = data.postal_code;
  if (data.country !== undefined) payload.country = data.country;
  if (data.is_default !== undefined) payload.is_default = data.is_default ? 1 : 0;
  
  const response = await put<{ data: RawApiAddress }>(`/api/v2/daffa-addresses/${id}`, payload);
  return mapRawToApiAddress(response.data);
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
  const response = await put<{ data: RawApiAddress }>(`/api/v2/daffa-addresses/${id}/default`, {});
  return mapRawToApiAddress(response.data);
}
