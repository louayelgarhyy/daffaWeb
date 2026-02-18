import { useState, useEffect, useCallback } from 'react';
import { productsApi, categoriesApi, ApiError } from '@/lib/api';
import type { ApiProduct, ApiCategory, ProductsResponse } from '@/lib/api/types';

// Hook for fetching products with pagination
export function useProducts(initialPage: number = 1, perPage: number = 20) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ProductsResponse = await productsApi.getProducts(pageNum, perPage);
      setProducts(response.data || []);
      setTotalPages(response.last_page || 1);
      setTotal(response.total || 0);
      setPage(response.current_page || pageNum);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load products');
      }
    } finally {
      setIsLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    fetchProducts(initialPage);
  }, [fetchProducts, initialPage]);

  const loadMore = useCallback(() => {
    if (page < totalPages) {
      fetchProducts(page + 1);
    }
  }, [page, totalPages, fetchProducts]);

  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchProducts(pageNum);
    }
  }, [fetchProducts, totalPages]);

  return {
    products,
    isLoading,
    error,
    page,
    totalPages,
    total,
    loadMore,
    goToPage,
    refresh: () => fetchProducts(page),
  };
}

// Hook for fetching a single product
export function useProduct(id: number | string | undefined) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productId = typeof id === 'string' ? parseInt(id, 10) : id;
        const data = await productsApi.getProduct(productId);
        setProduct(data);
        // Track view
        productsApi.incrementProductView(productId).catch(console.error);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load product');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, isLoading, error };
}

// Hook for searching products
export function useProductSearch() {
  const [results, setResults] = useState<ApiProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (
    searchTerm?: string,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number
  ) => {
    setIsSearching(true);
    setError(null);
    try {
      const response = await productsApi.searchProducts({
        search_term: searchTerm,
        category_id: categoryId,
        min_price: minPrice,
        max_price: maxPrice,
      });
      setResults(response.data || []);
    } catch (err) {
      console.error('Failed to search products:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Search failed');
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, isSearching, error, search, clearSearch };
}

// Hook for fetching categories
export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await categoriesApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load categories');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}

// Hook for fetching parent categories only (falls back to all categories on error)
export function useParentCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await categoriesApi.getParentCategories();
        setCategories(data);
      } catch (err) {
        console.warn('Parent categories endpoint failed, falling back to all categories:', err);
        try {
          const data = await categoriesApi.getCategories();
          setCategories(data);
        } catch (fallbackErr) {
          console.error('Failed to fetch categories:', fallbackErr);
          if (fallbackErr instanceof ApiError) {
            setError(fallbackErr.message);
          } else {
            setError('Failed to load categories');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}

// Hook for fetching subcategories
export function useSubcategories(parentId: number | undefined) {
  const [subcategories, setSubcategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!parentId) {
      setSubcategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await categoriesApi.getCategoriesByParent(parentId);
        setSubcategories(data);
      } catch (err) {
        console.error('Failed to fetch subcategories:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load subcategories');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategories();
  }, [parentId]);

  return { subcategories, isLoading, error };
}
