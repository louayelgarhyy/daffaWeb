// Products API endpoints
import { get, post } from './client';
import type {
  ApiProduct,
  ProductsResponse,
  ProductSearchRequest,
} from './types';

/**
 * Get all products with pagination
 */
export async function getProducts(page: number = 1, perPage: number = 20): Promise<ProductsResponse> {
  return get<ProductsResponse>(`/api/v2/daffa-products?page=${page}&per_page=${perPage}`, false);
}

/**
 * Get single product by ID
 */
export async function getProduct(id: number): Promise<ApiProduct> {
  const response = await get<{ data: ApiProduct }>(`/api/v2/daffa-products/show/${id}`, false);
  return response.data;
}

/**
 * Search products with filters
 */
export async function searchProducts(filters: ProductSearchRequest): Promise<ProductsResponse> {
  return post<ProductsResponse>('/api/v2/daffa-products/search', filters, false);
}

/**
 * Increment product view count
 */
export async function incrementProductView(id: number): Promise<void> {
  await post(`/api/v2/daffa-products/product_show/${id}`, undefined, false);
}
