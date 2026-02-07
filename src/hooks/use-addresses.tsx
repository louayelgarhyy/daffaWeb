import { useState, useEffect, useCallback } from 'react';
import { addressesApi, ApiError } from '@/lib/api';
import type { ApiAddress, CreateAddressRequest } from '@/lib/api/types';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useAddresses() {
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await addressesApi.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load addresses');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const createAddress = async (data: CreateAddressRequest): Promise<ApiAddress | null> => {
    try {
      const newAddress = await addressesApi.createAddress(data);
      setAddresses(prev => [...prev, newAddress]);
      toast.success('Address added successfully');
      return newAddress;
    } catch (err) {
      console.error('Failed to create address:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return null;
    }
  };

  const updateAddress = async (id: number, data: Partial<CreateAddressRequest>): Promise<boolean> => {
    try {
      const updated = await addressesApi.updateAddress(id, data);
      setAddresses(prev => prev.map(addr => addr.id === id ? updated : addr));
      toast.success('Address updated successfully');
      return true;
    } catch (err) {
      console.error('Failed to update address:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return false;
    }
  };

  const deleteAddress = async (id: number): Promise<boolean> => {
    try {
      await addressesApi.deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast.success('Address deleted successfully');
      return true;
    } catch (err) {
      console.error('Failed to delete address:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return false;
    }
  };

  const setAsDefault = async (id: number): Promise<boolean> => {
    try {
      await addressesApi.setDefaultAddress(id);
      // Update local state to reflect the new default
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        is_default: addr.id === id,
      })));
      toast.success('Default address updated');
      return true;
    } catch (err) {
      console.error('Failed to set default address:', err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
      return false;
    }
  };

  const getDefaultAddress = (): ApiAddress | null => {
    return addresses.find(addr => addr.is_default) || null;
  };

  return {
    addresses,
    isLoading,
    error,
    refresh: fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setAsDefault,
    getDefaultAddress,
  };
}
