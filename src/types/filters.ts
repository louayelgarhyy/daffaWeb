export interface ProductFilters {
  priceRange: [number, number];
  minRating: number | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  selectedSizes: string[];
}
