import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { cartApi, ApiError } from '@/lib/api';
import type { ApiCartItem, CartResponse } from '@/lib/api/types';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface CartContextType {
  items: ApiCartItem[];
  total: number;
  itemsCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity?: number) => Promise<boolean>;
  updateItemQuantity: (cartItemId: number, quantity: number) => Promise<boolean>;
  increaseQuantity: (cartItemId: number) => Promise<boolean>;
  decreaseQuantity: (cartItemId: number) => Promise<boolean>;
  removeItem: (cartItemId: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation('cart');
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<ApiCartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update cart state from response
  const updateCartState = (response: CartResponse) => {
    setItems(response.data || []);
    setTotal(response.total || 0);
    setItemsCount(response.items_count || 0);
    setError(null);
  };

  // Fetch cart from API
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setTotal(0);
      setItemsCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const response = await cartApi.getCart();
      updateCartState(response);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load cart when auth state changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Add to cart
  const addToCart = async (productId: number, quantity: number = 1): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    setIsLoading(true);
    try {
      const response = await cartApi.addToCart({
        daffa_product_id: productId,
        quantity,
      });
      updateCartState(response);
      toast.success(t('addedToCart', { defaultValue: 'Added to cart!' }));
      return true;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity
  const updateItemQuantity = async (cartItemId: number, quantity: number): Promise<boolean> => {
    if (quantity < 1) {
      return removeItem(cartItemId);
    }

    setIsLoading(true);
    try {
      const response = await cartApi.updateQuantity({ id: cartItemId, quantity });
      updateCartState(response);
      return true;
    } catch (err) {
      console.error('Failed to update quantity:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Increase quantity
  const increaseQuantity = async (cartItemId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await cartApi.increaseQuantity({ id: cartItemId });
      updateCartState(response);
      return true;
    } catch (err) {
      console.error('Failed to increase quantity:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (cartItemId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await cartApi.decreaseQuantity({ id: cartItemId });
      updateCartState(response);
      return true;
    } catch (err) {
      console.error('Failed to decrease quantity:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item
  const removeItem = async (cartItemId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await cartApi.removeCartItem({ id: cartItemId });
      updateCartState(response);
      toast.success(t('itemRemoved', { defaultValue: 'Item removed from cart' }));
      return true;
    } catch (err) {
      console.error('Failed to remove item:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      await cartApi.clearCart();
      setItems([]);
      setTotal(0);
      setItemsCount(0);
      toast.success(t('cartCleared', { defaultValue: 'Cart cleared' }));
      return true;
    } catch (err) {
      console.error('Failed to clear cart:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: CartContextType = {
    items,
    total,
    itemsCount,
    isLoading,
    error,
    addToCart,
    updateItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
