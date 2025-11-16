import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Sparkles, Shield, Truck } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { BannerCarousel } from "@/components/ui/banner-carousel";
import { Animation } from "@/components/ui/animation";
import { Banner } from "@/components/ui/banner";

const Home = () => {
  const navigate = useNavigate();

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
      <BannerCarousel slides={bannerSlides} />

      {/* Featured Products */}
      <section className="container px-4 py-16">
        <Animation type="fade" delay={200} duration={600}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-in slide-in-from-bottom duration-700">
              Featured Collection
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom duration-700 delay-100">
              Explore our carefully curated selection of the finest abayas, designed for the modern woman.
            </p>
          </div>
        </Animation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <Animation 
              key={product.id} 
              type="scale" 
              delay={100 * index} 
              duration={500}
            >
              <div className="transform hover:scale-105 transition-transform duration-300">
                <ProductCard {...product} />
              </div>
            </Animation>
          ))}
        </div>

        <Animation type="fade" delay={400} duration={600}>
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Animation>
      </section>

      {/* Features Section */}
      <section className="bg-card-secondary py-16 overflow-hidden">
        <div className="container px-4">
          <Animation type="fade" delay={100} duration={600}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 animate-in slide-in-from-bottom duration-700">
              Why Choose Daffa?
            </h2>
          </Animation>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Animation type="slide-up" delay={100} duration={600}>
              <div className="text-center space-y-3 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 group-hover:rotate-6 transform">
                  <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Only the finest fabrics and materials for lasting elegance
                </p>
              </div>
            </Animation>
            
            <Animation type="slide-up" delay={200} duration={600}>
              <div className="text-center space-y-3 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 group-hover:rotate-6 transform">
                  <Truck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Free Shipping</h3>
                <p className="text-muted-foreground">
                  Complimentary delivery on all orders over $100
                </p>
              </div>
            </Animation>
            
            <Animation type="slide-up" delay={300} duration={600}>
              <div className="text-center space-y-3 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 group-hover:rotate-6 transform">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Easy Returns</h3>
                <p className="text-muted-foreground">
                  30-day hassle-free returns for your peace of mind
                </p>
              </div>
            </Animation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16">
        <Animation type="scale" delay={200} duration={700}>
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
        </Animation>
      </section>
    </div>
  );
};

export default Home;
