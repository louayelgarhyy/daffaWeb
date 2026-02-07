import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTransition } from "@/components/PageTransition";
import { ProductFilterModal } from "@/components/products/ProductFilterModal";
import { ProductSkeleton } from "@/components/products/ProductSkeleton";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProducts } from "@/hooks/use-products";
import type { ProductFilters } from "@/types/filters";
import type { ApiProduct } from "@/lib/api/types";

// Convert API product to component props format
const mapApiProductToCard = (product: ApiProduct, lang: string) => ({
  id: String(product.id),
  name: lang === 'ar' && product.name_ar ? product.name_ar : product.name,
  nameAr: product.name_ar,
  price: product.price,
  image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop',
  rating: 4.5, // API doesn't have rating, use default
  reviews: 0,
  categoryId: product.category_id ? String(product.category_id) : 'all',
  inStock: product.is_active,
  sizes: product.size ? [product.size] : ['S', 'M', 'L', 'XL'],
});

const Shop = () => {
  const { t, i18n } = useTranslation(['shop', 'common']);
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const { products: apiProducts, isLoading, page, totalPages, loadMore, total } = useProducts(1, 20);

  // Map API products to display format
  const products = useMemo(() => 
    apiProducts.map(p => mapApiProductToCard(p, i18n.language)),
    [apiProducts, i18n.language]
  );

  // Sort products
  const sortedProducts = useMemo(() => {
    let sorted = [...products];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [products, sortBy]);

  // Default filters for the filter modal
  const defaultFilters: ProductFilters = {
    priceRange: [0, 1000],
    selectedSizes: [],
    inStockOnly: false,
    onSaleOnly: false,
    minRating: null,
  };

  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>(defaultFilters);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.priceRange[0] !== 0 || appliedFilters.priceRange[1] !== 1000) count++;
    if (appliedFilters.selectedSizes.length > 0) count++;
    if (appliedFilters.inStockOnly) count++;
    if (appliedFilters.onSaleOnly) count++;
    if (appliedFilters.minRating !== null) count++;
    return count;
  }, [appliedFilters]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-background py-12 border-b border-border">
          <div className="container px-4">
            <h1 className="text-4xl font-bold text-foreground mb-2">{t('shop:header.title')}</h1>
            <p className="text-muted-foreground">
              {t('shop:header.description')}
            </p>
          </div>
        </div>

        <div className="container px-4 py-8">
          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterOpen(true)}
                className="relative"
              >
                <SlidersHorizontal className="h-4 w-4 me-2" />
                {t('shop:filters.title')}
                {activeFilterCount > 0 && (
                  <Badge
                    variant="default"
                    className="ms-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t('common:common.showingResults', { count: total || products.length })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('shop:sorting.label')}</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">{t('shop:sorting.featured')}</SelectItem>
                  <SelectItem value="price-low">{t('shop:sorting.priceLowToHigh')}</SelectItem>
                  <SelectItem value="price-high">{t('shop:sorting.priceHighToLow')}</SelectItem>
                  <SelectItem value="newest">{t('shop:sorting.newest')}</SelectItem>
                  <SelectItem value="rating">{t('shop:sorting.bestRating')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product, index) => (
                  <ProductCard key={product.id} {...product} delay={index * 100} />
                ))}
              </div>

              {/* Load More */}
              {page < totalPages && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={loadMore}
                    disabled={isLoading}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {isLoading ? t('common:common.loading') : t('shop:actions.loadMore')}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 space-y-4">
              <p className="text-muted-foreground text-lg">
                {t('shop:noProducts')}
              </p>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        <ProductFilterModal
          open={filterOpen}
          onOpenChange={setFilterOpen}
          filters={appliedFilters}
          onApplyFilters={setAppliedFilters}
          availableProducts={[]}
          availableSizes={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
        />
      </div>
    </PageTransition>
  );
};

export default Shop;
