import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTransition } from "@/components/PageTransition";
import { CategoryFilterModal } from "@/components/products/CategoryFilterModal";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { subcategories } from "@/data/subcategories";

const CategoryPage = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const { t, i18n } = useTranslation(['shop', 'common', 'categories']);
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const isArabic = i18n.language === 'ar';

  // Find the current category and subcategory
  const currentCategory = categories.find(cat => cat.slug === category);
  const currentSubcategory = subcategory
    ? subcategories.find(sub => sub.slug === subcategory && sub.categoryId === currentCategory?.id)
    : null;

  // Filter products based on category/subcategory
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (currentSubcategory) {
      // Filter by subcategory
      filtered = products.filter(p => p.subcategoryId === currentSubcategory.id);
    } else if (currentCategory) {
      // Filter by category
      filtered = products.filter(p => p.categoryId === currentCategory.id);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "rating":
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return [...filtered].reverse();
      default:
        return filtered;
    }
  }, [currentCategory, currentSubcategory, sortBy]);

  // Get page title and description
  const pageTitle = currentSubcategory
    ? (isArabic ? currentSubcategory.nameAr : currentSubcategory.name)
    : currentCategory
    ? (isArabic ? currentCategory.nameAr : currentCategory.name)
    : t('shop:header.title');

  const pageDescription = currentSubcategory
    ? (isArabic ? currentSubcategory.descriptionAr : currentSubcategory.description)
    : currentCategory
    ? (isArabic ? currentCategory.descriptionAr : currentCategory.description)
    : t('shop:header.description');

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Page Header with Breadcrumb */}
        <div className="bg-card-secondary py-12 border-b border-border">
          <div className="container px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">
                {t('common:home')}
              </Link>
              <ChevronRight className="h-4 w-4" />
              {currentCategory && (
                <>
                  <Link
                    to={`/${currentCategory.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {isArabic ? currentCategory.nameAr : currentCategory.name}
                  </Link>
                  {currentSubcategory && (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-foreground">
                        {isArabic ? currentSubcategory.nameAr : currentSubcategory.name}
                      </span>
                    </>
                  )}
                </>
              )}
            </nav>

            <h1 className="text-4xl font-bold text-foreground mb-2">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageDescription}</p>
          </div>
        </div>

        <div className="container px-4 py-8">
          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t('shop:filters.filter')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} {t('shop:filters.products')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{t('shop:filters.sortBy')}:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">{t('shop:filters.featured')}</SelectItem>
                  <SelectItem value="price-low">{t('shop:filters.priceLow')}</SelectItem>
                  <SelectItem value="price-high">{t('shop:filters.priceHigh')}</SelectItem>
                  <SelectItem value="newest">{t('shop:filters.newest')}</SelectItem>
                  <SelectItem value="rating">{t('shop:filters.rating')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} {...product} delay={index * 100} />
            ))}
          </div>

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t('shop:noProducts')}</p>
            </div>
          )}

          {/* Load More Button (Placeholder) */}
          {filteredProducts.length > 0 && filteredProducts.length >= 12 && (
            <div className="flex justify-center">
              <Button variant="outline" size="lg">
                {t('shop:loadMore')}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Filter Modal */}
        <CategoryFilterModal open={filterOpen} onOpenChange={setFilterOpen} />
      </div>
    </PageTransition>
  );
};

export default CategoryPage;
