// Categories API endpoints
import { get, post } from './client';
import type { ApiCategory, CategoriesResponse } from './types';

/**
 * Get all categories
 */
export async function getCategories(): Promise<ApiCategory[]> {
  const response = await get<CategoriesResponse>('/api/v2/daffa-categories', false);
  return response.data;
}

/**
 * Get parent/top-level categories only
 */
export async function getParentCategories(): Promise<ApiCategory[]> {
  const response = await get<CategoriesResponse>('/api/v2/daffa-categories/parents', false);
  return response.data;
}

/**
 * Get single category by ID
 */
export async function getCategory(id: number): Promise<ApiCategory> {
  const response = await get<{ data: ApiCategory }>(`/api/v2/daffa-categories/show/${id}`, false);
  return response.data;
}

/**
 * Get subcategories by parent ID
 */
export async function getCategoriesByParent(parentId: number): Promise<ApiCategory[]> {
  const response = await get<CategoriesResponse>(`/api/v2/daffa-categories/parent/${parentId}`, false);
  return response.data;
}

/**
 * Search categories by name
 */
export async function searchCategories(searchTerm: string): Promise<ApiCategory[]> {
  const response = await post<CategoriesResponse>('/api/v2/daffa-categories/search', { search_term: searchTerm }, false);
  return response.data;
}
