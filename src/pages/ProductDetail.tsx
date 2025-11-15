import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Mock product data
  const product = {
    id: id,
    name: "Classic Black Abaya",
    price: 89.99,
    rating: 4.8,
    reviews: 124,
    description: "Experience timeless elegance with our Classic Black Abaya. Crafted from premium fabric, this piece combines traditional modesty with modern sophistication. Perfect for any occasion, its flowing silhouette and attention to detail make it a wardrobe essential.",
    features: [
      "Premium quality fabric",
      "Comfortable fit",
      "Easy care - machine washable",
      "Available in multiple sizes",
      "Modest and elegant design"
    ],
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true
  };

  const [currentImage, setCurrentImage] = useState(0);

  const handleAddToCart = () => {
    toast.success("Added to cart!", {
      description: `${quantity} x ${product.name} (Size: ${selectedSize})`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <Link to="/shop" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-card-secondary">
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                    currentImage === idx ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                {product.inStock && (
                  <span className="text-success font-medium">In Stock</span>
                )}
              </div>
            </div>

            <div className="text-3xl font-bold text-primary">${product.price}</div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? "bg-primary hover:bg-primary-hover" : ""}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-destructive border-destructive" : ""}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Buy Now
            </Button>

            {/* Features */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Quality Guarantee</p>
                  <p className="text-sm text-muted-foreground">Premium materials & craftsmanship</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Easy Returns</p>
                  <p className="text-sm text-muted-foreground">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Product Features</h2>
          <ul className="space-y-3">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
