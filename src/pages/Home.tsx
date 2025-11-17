import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Sparkles, Shield, Truck } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { BannerCarousel } from "@/components/ui/banner-carousel";
import { Animation } from "@/components/ui/animation";
import { Banner } from "@/components/ui/banner";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isCursorActive, setIsCursorActive] = useState(false);
  
  const featuredRef = useScrollAnimation({ threshold: 0.2 });
  const featuresRef = useScrollAnimation({ threshold: 0.3 });
  const ctaRef = useScrollAnimation({ threshold: 0.3 });

  const bannerSlides = [
    {
      id: "1",
      title: "Timeless Elegance in Every Stitch",
      subtitle: "Discover our collection of handcrafted abayas that blend traditional modesty with modern sophistication",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop",
      cta: {
        label: "Shop Now",
        onClick: () => navigate("/shop")
      }
    },
    {
      id: "2",
      title: "New Collection 2024",
      subtitle: "Embrace contemporary fashion with our latest designs crafted for the modern woman",
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1920&h=600&fit=crop",
      cta: {
        label: "Explore Collection",
        onClick: () => navigate("/shop")
      }
    },
    {
      id: "3",
      title: "Premium Quality Fabrics",
      subtitle: "Experience luxury and comfort with our carefully selected premium materials",
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1920&h=600&fit=crop",
      cta: {
        label: "View Fabrics",
        onClick: () => navigate("/shop")
      }
    }
  ];

  // Mock featured products
  const featuredProducts = [
    {
      id: "1",
      name: "Classic Black Abaya",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop",
      rating: 4.8,
      reviews: 124
    },
    {
      id: "2",
      name: "Elegant Navy Abaya",
      price: 94.99,
      image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop",
      rating: 4.9,
      reviews: 98
    },
    {
      id: "3",
      name: "Modern Grey Abaya",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop",
      rating: 4.7,
      reviews: 156
    },
    {
      id: "4",
      name: "Premium White Abaya",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      rating: 4.9,
      reviews: 203
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Cursor Effect */}
      {!isMobile && <CustomCursor isActive={isCursorActive} />}
      
      {/* Promotional Banner */}
      <Banner
        variant="promotional"
        message="🎉 Grand Opening Sale! Get 25% off on all items this week only!"
        action={{
          label: "Shop Now",
          onClick: () => navigate("/shop")
        }}
        className="animate-in slide-in-from-top duration-500"
      />

      {/* Hero Carousel Section */}
      <div 
        onMouseEnter={() => !isMobile && setIsCursorActive(true)}
        onMouseLeave={() => !isMobile && setIsCursorActive(false)}
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
              Featured Collection
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Explore our carefully curated selection of the finest abayas, designed for the modern woman.
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
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
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
              Why Choose Daffa?
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
                Join Our Community
              </h2>
              <p className="text-lg mb-8 opacity-90 animate-in slide-in-from-bottom duration-700 delay-100">
                Subscribe to get special offers, new arrivals, and styling tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto animate-in slide-in-from-bottom duration-700 delay-200">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-foreground bg-background border-0 focus:ring-2 focus:ring-accent transform hover:scale-105 transition-transform duration-300"
                />
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
