import { useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

const Shop = () => {
  const [sortBy, setSortBy] = useState("featured");

  // Mock products data
  const products = [
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
      reviews: 156,
      discount: 15
    },
    {
      id: "4",
      name: "Premium White Abaya",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      rating: 4.9,
      reviews: 203
    },
    {
      id: "5",
      name: "Designer Beige Abaya",
      price: 109.99,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
      rating: 4.8,
      reviews: 87,
      discount: 20
    },
    {
      id: "6",
      name: "Luxury Champagne Abaya",
      price: 119.99,
      image: "https://images.unsplash.com/photo-1558769132-cb1aea1f8cf5?w=400&h=500&fit=crop",
      rating: 5.0,
      reviews: 145
    },
    {
      id: "7",
      name: "Embroidered Black Abaya",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
      rating: 4.9,
      reviews: 112
    },
    {
      id: "8",
      name: "Casual Denim Abaya",
      price: 84.99,
      image: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=400&h=500&fit=crop",
      rating: 4.6,
      reviews: 78,
      discount: 10
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card-secondary py-12 border-b border-border">
        <div className="container px-4">
          <h1 className="text-4xl font-bold text-foreground mb-2">Shop All Abayas</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of elegant modest wear
          </p>
        </div>
      </div>

      <div className="container px-4 py-8">
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <span className="text-sm text-muted-foreground">
              Showing {products.length} products
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Best Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
