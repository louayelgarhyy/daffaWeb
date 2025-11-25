import type { Product } from '@/types/product';
import type { ProductFilters } from '@/types/filters';

/**
 * Filter products based on applied filters using AND logic
 */
export const filterProducts = (
  products: Product[],
  filters: ProductFilters
): Product[] => {
  return products.filter(product => {
    // Price range filter
    const matchesPrice =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];

    // Rating filter (minimum rating threshold)
    const matchesRating =
      !filters.minRating ||
      (product.rating !== undefined && product.rating >= filters.minRating);

    // Stock availability filter
    const matchesStock =
      !filters.inStockOnly ||
      product.inStock === true;

    // Sale/discount filter
    const matchesSale =
      !filters.onSaleOnly ||
      (product.discount !== undefined && product.discount > 0);

    // Size filter (product must have at least one selected size)
    const matchesSize =
      filters.selectedSizes.length === 0 ||
      (product.sizes &&
       product.sizes.some(size => filters.selectedSizes.includes(size)));

    // AND logic - all conditions must be true
    return matchesPrice && matchesRating && matchesStock && matchesSale && matchesSize;
  });
};

/**
 * Extract unique sizes from products and sort them in standard clothing size order
 */
export const getAvailableSizes = (products: Product[]): string[] => {
  const sizesSet = new Set<string>();

  products.forEach(product => {
    if (product.sizes) {
      product.sizes.forEach(size => sizesSet.add(size));
    }
  });

  // Sort sizes in typical clothing size order
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  return Array.from(sizesSet).sort((a, b) => {
    const aIndex = sizeOrder.indexOf(a);
    const bIndex = sizeOrder.indexOf(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};

/**
 * Generate default filter state with dynamic price range from products
 */
export const getDefaultFilters = (products: Product[]): ProductFilters => {
  if (products.length === 0) {
    return {
      priceRange: [0, 500],
      minRating: null,
      inStockOnly: false,
      onSaleOnly: false,
      selectedSizes: [],
    };
  }

  const prices = products.map(p => p.price);
  const minPrice = Math.floor(Math.min(...prices));
  const maxPrice = Math.ceil(Math.max(...prices));

  return {
    priceRange: [minPrice, maxPrice],
    minRating: null,
    inStockOnly: false,
    onSaleOnly: false,
    selectedSizes: [],
  };
};

/**
 * Count how many filters are active (differ from defaults)
 */
export const getActiveFilterCount = (
  filters: ProductFilters,
  defaultFilters: ProductFilters
): number => {
  let count = 0;

  // Price range (if different from default min/max)
  if (
    filters.priceRange[0] !== defaultFilters.priceRange[0] ||
    filters.priceRange[1] !== defaultFilters.priceRange[1]
  ) {
    count++;
  }

  // Rating filter
  if (filters.minRating !== null) {
    count++;
  }

  // Stock filter
  if (filters.inStockOnly) {
    count++;
  }

  // Sale filter
  if (filters.onSaleOnly) {
    count++;
  }

  // Size filters (each size counts as one)
  count += filters.selectedSizes.length;

  return count;
};
