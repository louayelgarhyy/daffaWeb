import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Sparkles, Shield, Truck } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { BannerCarousel } from "@/components/ui/banner-carousel";
import { Animation } from "@/components/ui/animation";
import { Banner } from "@/components/ui/banner";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { PageTransition } from "@/components/PageTransition";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation(['home', 'common']);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isCursorActive, setIsCursorActive] = useState(false);
  
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

  // Mock featured products
  const featuredProducts = [
    {
      id: "1",
      name: t('home:products.classicBlack'),
      price: 89.99,
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop",
      rating: 4.8,
      reviews: 124
    },
    {
      id: "2",
      name: t('home:products.elegantNavy'),
      price: 94.99,
      image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop",
      rating: 4.9,
      reviews: 98
    },
    {
      id: "3",
      name: t('home:products.modernGrey'),
      price: 79.99,
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop",
      rating: 4.7,
      reviews: 156
    },
    {
      id: "4",
      name: t('home:products.premiumWhite'),
      price: 99.99,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      rating: 4.9,
      reviews: 203
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Custom Cursor Effect */}
        {!isMobile && <CustomCursor isActive={isCursorActive} />}

        {/* Promotional Banner */}
        <Banner
        variant="promotional"
        message={t('home:banner.grandOpening')}
        action={{
          label: t('common:buttons.shopNow'),
          onClick: () => navigate("/shop")
        }}
        className="animate-in slide-in-from-top duration-500"
      />

      {/* Hero Carousel Section */}
      <div 
        // onMouseEnter={() => !isMobile && setIsCursorActive(true)}
        // onMouseLeave={() => !isMobile && setIsCursorActive(false)}
      >
        <BannerCarousel slides={bannerSlides} />
      </div>

      {/* Featured Products */}
      <section 
        ref={featuredRef.elementRef}
        className="container px-4 py-12 md:py-16"
      >
        <div className={`transition-all duration-1000 ${
            featuredRef.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-20'
        }`}>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 md:mb-4 px-4">
              {t('home:featured.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {t('home:featured.description')}
            </p>
          </div>
        </div>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          onMouseEnter={() => !isMobile && setIsCursorActive(true)}
          onMouseLeave={() => !isMobile && setIsCursorActive(false)}
        >
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`transform transition-all duration-700 hover:scale-105 ${
                featuredRef.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        <Animation type="fade" delay={400} duration={600}>
          <div className="text-center mt-8 md:mt-12">
            <Link to="/shop">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                {t('home:featured.viewAll')}
                <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Animation>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef.elementRef}
        className="bg-card-secondary py-12 md:py-16 overflow-hidden"
      >
        <div className="container px-4">
          <div className={`transition-all duration-1000 ${
            featuresRef.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-20'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-8 md:mb-12 px-4">
              {t('home:whyChoose.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
...
          </div>
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
          <div className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-12 text-center text-primary-foreground relative overflow-hidden group">
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
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
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
