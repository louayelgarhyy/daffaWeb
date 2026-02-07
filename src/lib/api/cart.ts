// Cart API endpoints
import { get, post, put, del } from './client';
import type {
  CartResponse,
  AddToCartRequest,
  CartItemRequest,
  UpdateQuantityRequest,
} from './types';

/**
 * Get cart items
 */
export async function getCart(): Promise<CartResponse> {
  return get<CartResponse>('/api/v2/cart');
}

/**
 * Add product to cart
 */
export async function addToCart(data: AddToCartRequest): Promise<CartResponse> {
  return post<CartResponse>('/api/v2/cart/add', data);
}

/**
 * Increase cart item quantity by 1
 */
export async function increaseQuantity(data: CartItemRequest): Promise<CartResponse> {
  return put<CartResponse>('/api/v2/cart/increase', data);
}

/**
 * Decrease cart item quantity by 1
 */
export async function decreaseQuantity(data: CartItemRequest): Promise<CartResponse> {
  return put<CartResponse>('/api/v2/cart/decrease', data);
}

/**
 * Update cart item to exact quantity
 */
export async function updateQuantity(data: UpdateQuantityRequest): Promise<CartResponse> {
  return put<CartResponse>('/api/v2/cart/update-quantity', data);
}

/**
 * Remove single item from cart
 */
export async function removeCartItem(data: CartItemRequest): Promise<CartResponse> {
  return del<CartResponse>('/api/v2/cart/item', data);
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<void> {
  await del('/api/v2/cart/clear');
}
