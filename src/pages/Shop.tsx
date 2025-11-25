import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTransition } from "@/components/PageTransition";
import { CategoryFilterModal } from "@/components/products/CategoryFilterModal";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { products as allProducts } from "@/data/products";

const Shop = () => {
  const { t } = useTranslation(['shop', 'common']);
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  // Sort products based on selected option
  const products = useMemo(() => {
    let sorted = [...allProducts];

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
  }, [sortBy]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card-secondary py-12 border-b border-border">
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
            >
              <SlidersHorizontal className="h-4 w-4 me-2" />
              {t('shop:filters.title')}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t('common:common.showingResults', { count: products.length })}
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} {...product} delay={index * 100} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            {t('shop:actions.loadMore')}
          </Button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <CategoryFilterModal open={filterOpen} onOpenChange={setFilterOpen} />
      </div>
    </PageTransition>
  );
};

export default Shop;
