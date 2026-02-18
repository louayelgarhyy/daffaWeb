import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTransition } from "@/components/PageTransition";
import { ProductGridSkeleton } from "@/components/products/ProductSkeleton";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { productsApi, categoriesApi, ApiError } from "@/lib/api";
import type { ApiProduct, ApiCategory } from "@/lib/api/types";

const CategoryPage = () => {
  const { category: categoryId } = useParams<{ category: string }>();
  const { t, i18n } = useTranslation(['shop', 'common']);
  const [sortBy, setSortBy] = useState("featured");
  const isArabic = i18n.language === 'ar';

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch category info & products
  useEffect(() => {
    if (!categoryId) return;
    const id = parseInt(categoryId, 10);

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setProducts([]);
      setPage(1);
      try {
        const [categoryData, productsData] = await Promise.all([
          categoriesApi.getCategory(id).catch(() => null),
          productsApi.searchProducts({ category_id: id }),
        ]);
        setCategory(categoryData);
        const items = Array.isArray(productsData?.data) ? productsData.data : [];
        setProducts(items);
        setTotalPages(productsData?.last_page || 1);
        setTotal(productsData?.total || items.length);
      } catch (err) {
        console.error('Failed to fetch category data:', err);
        setError(err instanceof ApiError ? err.message : t('common:common.error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const loadMore = async () => {
    if (!categoryId || page >= totalPages) return;
    const id = parseInt(categoryId, 10);
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const data = await productsApi.searchProducts({ category_id: id });
      const items = Array.isArray(data?.data) ? data.data : [];
      setProducts(prev => [...prev, ...items]);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Sort
  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sortBy) {
      case "price-low": return list.sort((a, b) => a.price - b.price);
      case "price-high": return list.sort((a, b) => b.price - a.price);
      case "newest": return list.reverse();
      default: return list;
    }
  }, [products, sortBy]);

  const categoryName = category
    ? (isArabic ? (category.name_ar || category.name) : category.name)
    : '';

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-card-secondary py-12 border-b border-border">
          <div className="container px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">
                {t('common:nav.home')}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{categoryName || t('shop:header.title')}</span>
            </nav>

            <h1 className="text-4xl font-bold text-foreground mb-2">
              {categoryName || t('shop:header.title')}
            </h1>
            {total > 0 && (
              <p className="text-muted-foreground">
                {t('shop:filters.showingResults', { count: total })}
              </p>
            )}
          </div>
        </div>

        <div className="container px-4 py-8">
          {/* Sort Bar */}
          {!isLoading && sortedProducts.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {sortedProducts.length} {t('shop:filters.products')}
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && <ProductGridSkeleton count={8} />}

          {/* Error */}
          {!isLoading && error && (
            <div className="text-center py-16 space-y-4">
              <p className="text-muted-foreground text-lg">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                {t('common:buttons.returnHome')}
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && sortedProducts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={String(product.id)}
                    name={isArabic ? (product.name_ar || product.name) : product.name}
                    price={product.price}
                    image={
                      product.image
                        ? (product.image.startsWith('http') ? product.image : `https://appdaffah.com/${product.image}`)
                        : (product.images?.[0]?.url) || '/placeholder.svg'
                    }
                    discount={product.discount ?? undefined}
                    productData={product}
                  />
                ))}
              </div>

              {page < totalPages && (
                <div className="flex justify-center">
                  <Button variant="outline" size="lg" onClick={loadMore} disabled={isLoadingMore}>
                    {isLoadingMore ? t('common:common.loading') : t('shop:loadMore')}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty */}
          {!isLoading && !error && sortedProducts.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <p className="text-muted-foreground text-lg">{t('shop:noProducts')}</p>
              <Button variant="outline" asChild>
                <Link to="/">{t('common:buttons.returnHome')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default CategoryPage;
