// API Types matching the Daffa Order System backend

// ============ Auth Types ============
export interface LoginRequest {
  phone: string;
  password: string;
  country_id: number;
}

export interface LoginResponse {
  access_token: string;
  user: ApiUser;
}

export interface RegisterDataRequest {
  name: string;
  phone: string;
  password: string;
  country_id: number;
  type: 'user';
}

export interface RegisterDataResponse {
  message: string;
  verification_code?: string; // For development/testing
}

export interface RegisterCodeRequest {
  phone: string;
  code: string;
  country_id: number;
}

export interface RegisterCodeResponse {
  access_token: string;
  user: ApiUser;
}

export interface ApiUser {
  id: number;
  name: string;
  phone: string;
  country_id: number;
  type: string;
  created_at: string;
}

// ============ Product Types ============
export interface ApiProduct {
  id: number;
  name: string;
  name_ar?: string;
  code?: string;
  price: number;
  description?: string;
  description_ar?: string;
  size?: string;
  modal?: string;
  currency: string;
  is_active: boolean;
  category_id?: number;
  category?: ApiCategory;
  images?: ApiProductImage[];
  views_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiProductImage {
  id: number;
  url: string;
  is_primary?: boolean;
}

export interface ProductsResponse {
  data: ApiProduct[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductSearchRequest {
  search_term?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
}

// ============ Category Types ============
export interface ApiCategory {
  id: number;
  name: string;
  name_ar?: string;
  parent_id?: number;
  image?: string;
  is_active: boolean;
  children?: ApiCategory[];
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  data: ApiCategory[];
}

// ============ Cart Types ============
export interface ApiCartItem {
  id: number;
  daffa_product_id: number;
  quantity: number;
  product: ApiProduct;
  created_at: string;
}

export interface CartResponse {
  data: ApiCartItem[];
  total: number;
  items_count: number;
}

export interface AddToCartRequest {
  daffa_product_id: number;
  quantity: number;
}

export interface CartItemRequest {
  id: number;
}

export interface UpdateQuantityRequest {
  id: number;
  quantity: number;
}

// ============ Address Types ============
export interface ApiAddress {
  id: number;
  title?: string;
  full_name: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  region: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface AddressesResponse {
  data: ApiAddress[];
}

export interface CreateAddressRequest {
  title?: string;
  full_name: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  region: string;
  postal_code?: string;
  country: string;
  is_default?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {
  id: number;
}

// ============ Order Types ============
export type ApiOrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'delivering'
  | 'completed'
  | 'canceled'
  | 'user_canceled';

export type ApiPaymentMethod = 'cash' | 'card';

export interface ApiOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  total: number;
  product?: ApiProduct;
}

export interface ApiOrder {
  id: number;
  order_number: string;
  user_id: number;
  address_id: number;
  status: ApiOrderStatus;
  payment_method: ApiPaymentMethod;
  subtotal: number;
  delivery_price: number;
  taxes: number;
  discount: number;
  total: number;
  notes?: string;
  address?: ApiAddress;
  items: ApiOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  address_id: number;
  payment_method: ApiPaymentMethod;
  notes?: string;
  delivery_price?: number;
  taxes?: number;
}

export interface OrdersResponse {
  data: ApiOrder[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface OrderStatsResponse {
  pending_count: number;
  confirmed_count: number;
  processing_count: number;
  delivering_count: number;
  completed_count: number;
  canceled_count: number;
  total_spent: number;
}

// ============ Country Types ============
export interface ApiCountry {
  id: number;
  name: string;
  name_ar?: string;
  code: string;
  dial_code: string;
}
