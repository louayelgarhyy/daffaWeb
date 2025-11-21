import type { SavedAddress } from '@/types/order';

const STORAGE_KEY = 'savedAddresses';

export const getSavedAddresses = (): SavedAddress[] => {
  try {
    const addresses = localStorage.getItem(STORAGE_KEY);
    return addresses ? JSON.parse(addresses) : [];
  } catch (error) {
    console.error('Error loading saved addresses:', error);
    return [];
  }
};

export const saveAddress = (address: Omit<SavedAddress, 'id'>): SavedAddress => {
  const addresses = getSavedAddresses();

  // Generate unique ID
  const id = `addr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // If this is the first address or marked as default, set it as default
  const isDefault = addresses.length === 0 || address.isDefault;

  // If setting as default, unset all other defaults
  if (isDefault) {
    addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  const newAddress: SavedAddress = {
    ...address,
    id,
    isDefault,
  };

  addresses.push(newAddress);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));

  return newAddress;
};

export const updateAddress = (id: string, updates: Partial<Omit<SavedAddress, 'id'>>): boolean => {
  const addresses = getSavedAddresses();
  const index = addresses.findIndex(addr => addr.id === id);

  if (index === -1) return false;

  // If setting as default, unset all other defaults
  if (updates.isDefault) {
    addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  addresses[index] = {
    ...addresses[index],
    ...updates,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  return true;
};

export const deleteAddress = (id: string): boolean => {
  const addresses = getSavedAddresses();
  const filteredAddresses = addresses.filter(addr => addr.id !== id);

  if (filteredAddresses.length === addresses.length) return false;

  // If deleted address was default and there are remaining addresses,
  // set first one as default
  const deletedAddress = addresses.find(addr => addr.id === id);
  if (deletedAddress?.isDefault && filteredAddresses.length > 0) {
    filteredAddresses[0].isDefault = true;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAddresses));
  return true;
};

export const setDefaultAddress = (id: string): boolean => {
  return updateAddress(id, { isDefault: true });
};

export const getDefaultAddress = (): SavedAddress | null => {
  const addresses = getSavedAddresses();
  return addresses.find(addr => addr.isDefault) || null;
};

export const getAddressById = (id: string): SavedAddress | null => {
  const addresses = getSavedAddresses();
  return addresses.find(addr => addr.id === id) || null;
};
