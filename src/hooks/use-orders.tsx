import { useState, useEffect, useCallback } from 'react';
import { ordersApi, ApiError } from '@/lib/api';
import type { ApiOrder, ApiOrderStatus, OrderStatsResponse } from '@/lib/api/types';
import { useAuth } from './use-auth';

// Hook for fetching orders with pagination
export function useOrders(perPage: number = 15, statusFilter?: ApiOrderStatus) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async (pageNum: number) => {
    if (!isAuthenticated) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await ordersApi.getOrders(pageNum, perPage, 'created_at', 'desc', statusFilter);
      setOrders(response.data || []);
      setTotalPages(response.last_page || 1);
      setTotal(response.total || 0);
      setPage(response.current_page || pageNum);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load orders');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, perPage, statusFilter]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const loadMore = useCallback(() => {
    if (page < totalPages) {
      fetchOrders(page + 1);
    }
  }, [page, totalPages, fetchOrders]);

  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchOrders(pageNum);
    }
  }, [fetchOrders, totalPages]);

  return {
    orders,
    isLoading,
    error,
    page,
    totalPages,
    total,
    loadMore,
    goToPage,
    refresh: () => fetchOrders(page),
  };
}

// Hook for fetching a single order
export function useOrder(id: number | string | undefined) {
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id || !isAuthenticated) {
      setOrder(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const orderId = typeof id === 'string' ? parseInt(id, 10) : id;
      const data = await ordersApi.getOrder(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load order');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, isLoading, error, refresh: fetchOrder };
}

// Hook for order statistics
export function useOrderStats() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<OrderStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ordersApi.getOrderStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch order stats:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load order statistics');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  return { stats, isLoading, error };
}
