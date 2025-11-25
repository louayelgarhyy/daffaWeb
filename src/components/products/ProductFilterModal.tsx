import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { StarRatingButton } from "@/components/products/StarRatingButton";
import { useTranslation } from "react-i18next";
import type { ProductFilters } from "@/types/filters";
import type { Product } from "@/types/product";
import { getDefaultFilters } from "@/utils/filterProducts";

interface ProductFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ProductFilters;
  onApplyFilters: (filters: ProductFilters) => void;
  availableProducts: Product[];
  availableSizes: string[];
}

export const ProductFilterModal = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  availableProducts,
  availableSizes,
}: ProductFilterModalProps) => {
  const { t, i18n } = useTranslation(['shop', 'common']);
  const isArabic = i18n.language === 'ar';

  // Pending filters (local state for user interaction)
  const [pendingFilters, setPendingFilters] = useState<ProductFilters>(filters);

  // Calculate dynamic price range from available products
  const defaultFilters = getDefaultFilters(availableProducts);
  const dynamicMin = defaultFilters.priceRange[0];
  const dynamicMax = defaultFilters.priceRange[1];

  // Update pending filters when modal opens or applied filters change
  useEffect(() => {
    if (open) {
      setPendingFilters(filters);
    }
  }, [open, filters]);

  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    setPendingFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }));
  };

  // Handle rating change
  const handleRatingChange = (rating: number | null) => {
    setPendingFilters(prev => ({
      ...prev,
      minRating: rating,
    }));
  };

  // Handle stock toggle
  const handleStockToggle = (pressed: boolean) => {
    setPendingFilters(prev => ({
      ...prev,
      inStockOnly: pressed,
    }));
  };

  // Handle sale toggle
  const handleSaleToggle = (pressed: boolean) => {
    setPendingFilters(prev => ({
      ...prev,
      onSaleOnly: pressed,
    }));
  };

  // Handle size toggle
  const handleSizeToggle = (size: string) => {
    setPendingFilters(prev => {
      const isSelected = prev.selectedSizes.includes(size);
      return {
        ...prev,
        selectedSizes: isSelected
          ? prev.selectedSizes.filter(s => s !== size)
          : [...prev.selectedSizes, size],
      };
    });
  };

  // Apply filters and close modal
  const handleApply = () => {
    onApplyFilters(pendingFilters);
    onOpenChange(false);
  };

  // Clear all filters and close modal
  const handleClearAll = () => {
    const cleared = getDefaultFilters(availableProducts);
    setPendingFilters(cleared);
    onApplyFilters(cleared);
    onOpenChange(false);
  };

  // Format currency with RTL support
  const formatCurrency = (price: number) => {
    const currency = t('common:currency');
    const formatted = price.toFixed(2);
    return isArabic ? `${formatted} ${currency}` : `${currency} ${formatted}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isArabic ? 'right' : 'left'} className="w-[300px] sm:w-[400px] flex flex-col">
        {/* Header */}
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{t('shop:filters.title')}</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('shop:filters.clearAll')}
            </Button>
          </div>
        </SheetHeader>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto py-4">
          <Accordion type="multiple" defaultValue={["price", "rating", "availability", "sizes"]} className="w-full">

            {/* Price Range Section */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-foreground font-medium">
                {t('shop:filters.priceRange')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <Slider
                    min={dynamicMin}
                    max={dynamicMax}
                    step={1}
                    value={pendingFilters.priceRange}
                    onValueChange={handlePriceChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>{formatCurrency(pendingFilters.priceRange[0])}</span>
                    <span>{formatCurrency(pendingFilters.priceRange[1])}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Rating Section */}
            <AccordionItem value="rating">
              <AccordionTrigger className="text-foreground font-medium">
                {t('shop:filters.rating')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 pt-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <StarRatingButton
                      key={rating}
                      rating={rating}
                      isSelected={pendingFilters.minRating === rating}
                      onClick={() => handleRatingChange(rating)}
                      label={rating === 5
                        ? t('shop:filters.fiveStars')
                        : t('shop:filters.starsAndUp', { rating })
                      }
                    />
                  ))}
                  <Button
                    variant="ghost"
                    onClick={() => handleRatingChange(null)}
                    className="w-full justify-start"
                  >
                    {t('shop:filters.anyRating')}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Availability Section */}
            <AccordionItem value="availability">
              <AccordionTrigger className="text-foreground font-medium">
                {t('shop:filters.availability')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {/* In Stock Toggle */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="stock-toggle" className="text-sm font-medium cursor-pointer">
                      {t('shop:filters.inStockOnly')}
                    </label>
                    <Toggle
                      id="stock-toggle"
                      pressed={pendingFilters.inStockOnly}
                      onPressedChange={handleStockToggle}
                      aria-label={t('shop:filters.inStockOnly')}
                    />
                  </div>

                  {/* On Sale Toggle */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="sale-toggle" className="text-sm font-medium cursor-pointer">
                      {t('shop:filters.onSale')}
                    </label>
                    <Toggle
                      id="sale-toggle"
                      pressed={pendingFilters.onSaleOnly}
                      onPressedChange={handleSaleToggle}
                      aria-label={t('shop:filters.onSale')}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sizes Section */}
            {availableSizes.length > 0 && (
              <AccordionItem value="sizes">
                <AccordionTrigger className="text-foreground font-medium">
                  {t('shop:filters.sizes')}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {availableSizes.map(size => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={pendingFilters.selectedSizes.includes(size)}
                          onCheckedChange={() => handleSizeToggle(size)}
                        />
                        <label
                          htmlFor={`size-${size}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

          </Accordion>
        </div>

        {/* Footer with Apply button */}
        <div className="border-t border-border pt-4 mt-auto">
          <Button onClick={handleApply} className="w-full" size="lg">
            {t('shop:filters.applyFilters')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
