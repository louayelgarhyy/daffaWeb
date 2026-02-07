// Orders API endpoints
import { get, post, put } from './client';
import type {
  ApiOrder,
  OrdersResponse,
  CreateOrderRequest,
  OrderStatsResponse,
  ApiOrderStatus,
} from './types';

/**
 * Create order from cart
 */
export async function createOrder(data: CreateOrderRequest): Promise<ApiOrder> {
  const response = await post<{ data: ApiOrder }>('/api/v2/daffa-orders/create', data);
  return response.data;
}

/**
 * Get all orders with pagination
 */
export async function getOrders(
  page: number = 1,
  perPage: number = 15,
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc',
  status?: ApiOrderStatus
): Promise<OrdersResponse> {
  let url = `/api/v2/daffa-orders?page=${page}&per_page=${perPage}&sort_by=${sortBy}&sort_order=${sortOrder}`;
  if (status) {
    url += `&status=${status}`;
  }
  return get<OrdersResponse>(url);
}

/**
 * Get order by ID
 */
export async function getOrder(id: number): Promise<ApiOrder> {
  const response = await get<{ data: ApiOrder }>(`/api/v2/daffa-orders/${id}`);
  return response.data;
}

/**
 * Get order statistics
 */
export async function getOrderStats(): Promise<OrderStatsResponse> {
  return get<OrderStatsResponse>('/api/v2/daffa-orders/stats');
}

/**
 * Cancel order (user)
 */
export async function cancelOrder(id: number): Promise<ApiOrder> {
  const response = await put<{ data: ApiOrder }>(`/api/v2/daffa-orders/${id}/cancel`, {});
  return response.data;
}
