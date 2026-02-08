import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/products/ProductCard";
import { BannerCarousel } from "@/components/ui/banner-carousel";
import { SectionHeading } from "@/components/home/SectionHeading";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { PageTransition } from "@/components/PageTransition";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProducts } from "@/hooks/use-products";
import { testimonials } from "@/data/testimonials";
import { Button } from "@/components/ui/button";
import { ProductSkeleton } from "@/components/products/ProductSkeleton";
import type { ApiProduct } from "@/lib/api/types";

// Convert API product to component props format
const mapApiProductToCard = (product: ApiProduct, lang: string) => ({
  id: String(product.id),
  name: lang === 'ar' && product.name_ar ? product.name_ar : product.name,
  nameAr: product.name_ar,
  price: product.price,
  image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop',
  rating: 4.5,
  reviews: 0,
  categoryId: product.category_id ? String(product.category_id) : 'all',
  inStock: product.is_active,
  sizes: product.size ? [product.size] : ['S', 'M', 'L', 'XL'],
});

const Home = () => {
  const { t, i18n } = useTranslation(['home', 'common']);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isCursorActive, setIsCursorActive] = useState(false);
  
  // Fetch products from API
  const {
    products: apiProducts,
    isLoading,
    error: productsError,
    refresh: refreshProducts,
  } = useProducts(1, 24);
  
  // Map API products to display format
  const products = useMemo(() => 
    apiProducts.map(p => mapApiProductToCard(p, i18n.language)),
    [apiProducts, i18n.language]
  );
  
  const featuredRef = useScrollAnimation({ threshold: 0.2 });
  const featuresRef = useScrollAnimation({ threshold: 0.3 });
  const ctaRef = useScrollAnimation({ threshold: 0.3 });

  const bannerSlides = [
    {
      id: "1",
      title: t('home:hero.slide1.title'),
      subtitle: t('home:hero.slide1.description'),
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop",
      cta: {
        label: t('home:hero.slide1.cta'),
        onClick: () => navigate("/shop")
      }
    },
    {
      id: "2",
      title: t('home:hero.slide2.title'),
      subtitle: t('home:hero.slide2.description'),
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1920&h=600&fit=crop",
      cta: {
        label: t('home:hero.slide2.cta'),
        onClick: () => navigate("/shop")
      }
    },
    {
      id: "3",
      title: t('home:hero.slide3.title'),
      subtitle: t('home:hero.slide3.description'),
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1920&h=600&fit=crop",
      cta: {
        label: t('home:hero.slide3.cta'),
        onClick: () => navigate("/shop")
      }
    }
  ];

  // Split products into sections for homepage
  const allProducts = products.slice(0, 8);
  const bestSellers = products.slice(8, 16);
  const latestLooks = products.slice(16, 24);

  // Loading skeleton component
  const ProductsGrid = ({ items, isLoading: loading }: { items: typeof products; isLoading: boolean }) => {
    if (loading) {
      return (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </>
      );
    }
    return (
      <>
        {items.map((product, index) => (
          <div
            key={product.id}
            className="transform transition-all duration-700 hover:scale-[1.02]"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <ProductCard {...product} />
          </div>
        ))}
      </>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Custom Cursor Effect */}
        {!isMobile && <CustomCursor isActive={isCursorActive} />}

        {/* Hero Carousel Section */}
      <div 
        // onMouseEnter={() => !isMobile && setIsCursorActive(true)}
        // onMouseLeave={() => !isMobile && setIsCursorActive(false)}
      >
        <BannerCarousel slides={bannerSlides} />
      </div>

      {/* All Abayas Section */}
      <section
        ref={featuredRef.elementRef}
        className="container px-4 py-12 md:py-16"
      >
        <div className={`transition-all duration-1000 ${
            featuredRef.isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20'
        }`}>
          <SectionHeading
            title={t('home:sections.allAbayas.title')}
            viewAllLink="/shop"
            viewAllLabel={t('home:sections.allAbayas.viewMore')}
          />
        </div>

        {productsError && !isLoading && (
          <div className="mb-4 rounded-lg border border-border bg-muted p-4 text-sm text-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="leading-relaxed">{productsError}</span>
            <Button variant="secondary" size="sm" onClick={refreshProducts}>
              {i18n.language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </Button>
          </div>
        )}

        <div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          onMouseEnter={() => !isMobile && setIsCursorActive(true)}
          onMouseLeave={() => !isMobile && setIsCursorActive(false)}
        >
          <ProductsGrid items={allProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Best Sellers Section */}
      <section ref={featuresRef.elementRef} className="bg-secondary py-12 md:py-16">
        <div className="container px-4">
          <div className={`transition-all duration-1000 ${
            featuresRef.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}>
            <SectionHeading
              title={t('home:sections.bestSellers.title')}
              viewAllLink="/shop?filter=bestseller"
              viewAllLabel={t('home:sections.bestSellers.viewMore', { defaultValue: 'عرض الكل' })}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <ProductsGrid items={bestSellers} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Latest Looks Section */}
      <section className="container px-4 py-12 md:py-16">
        <div className={`transition-all duration-1000 ${
          ctaRef.isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20'
        }`}>
          <SectionHeading
            title={t('home:sections.latestLooks.title')}
            viewAllLink="/shop?filter=new"
            viewAllLabel={t('home:sections.latestLooks.viewMore', { defaultValue: 'عرض الكل' })}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductsGrid items={latestLooks} isLoading={isLoading} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="container px-4">
          <SectionHeading
            title={t('home:sections.testimonials.title')}
            subtitle={t('home:sections.testimonials.subtitle')}
            align="center"
          />
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef.elementRef}
        className="container px-4 py-16"
      >
        <div className={`transition-all duration-1000 ${
          ctaRef.isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}>
          <div className="bg-gradient-to-r from-foreground to-foreground/90 rounded-2xl p-12 text-center text-background relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAzLTVzMi0yIDItM2MwLTEtMS0yLTItMi0xIDAtMiAxLTMgMi0xIDItMyAzLTMgNXptMCA2YzEgMCAyLTEgMi0ycy0xLTItMi0yLTIgMS0yIDIgMSAyIDIgMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-in slide-in-from-bottom duration-700">
                {t('home:cta.title')}
              </h2>
              <p className="text-lg mb-8 opacity-90 animate-in slide-in-from-bottom duration-700 delay-100">
                {t('home:cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto animate-in slide-in-from-bottom duration-700 delay-200">
                <input
                  type="email"
                  placeholder={t('home:cta.emailPlaceholder')}
                  className="flex-1 px-4 py-3 rounded-lg text-foreground bg-background border-0 focus:ring-2 focus:ring-accent transform hover:scale-105 transition-transform duration-300"
                />
                <Button size="lg" className="bg-background hover:bg-background/90 text-foreground shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  {t('home:cta.subscribe')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PageTransition>
  );
};

export default Home;
