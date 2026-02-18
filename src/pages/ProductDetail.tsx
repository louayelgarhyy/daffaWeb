import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";
import { useTranslation } from "react-i18next";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginRequiredDialog } from "@/components/LoginRequiredDialog";
import type { ApiProduct } from "@/lib/api/types";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation(['product', 'common']);
  const isRTL = i18n.language === 'ar';

  // Use product passed via navigation state (from ProductCard) to avoid broken product_show endpoint
  const stateProduct = (location.state as { product?: ApiProduct } | null)?.product ?? null;
  const { product, isLoading, error } = useProduct(id, stateProduct);

  const { addToCart, isLoading: isAddingToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Get product images - search API returns single `image`, product_show returns `images` array
  const imageList = product?.images?.map(img => img.url) ||
    (product?.image ? [product.image.startsWith('http') ? product.image : `https://appdaffah.com/${product.image}`] : [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop"
    ]);

  // Get product name in correct language
  const productName = isRTL && product?.name_ar ? product.name_ar : (product?.name || '');
  // Support both `description` (product_show) and `desc` (search endpoint)
  const productDescription = isRTL && product?.description_ar
    ? product.description_ar
    : (product?.description || (product as ApiProduct & { desc?: string })?.desc);

  // Available sizes (from product or defaults)
  const sizes = product?.size ? [product.size] : ["XS", "S", "M", "L", "XL", "XXL"];

  // Auto-select if only one size
  if (sizes.length === 1 && selectedSize !== sizes[0]) {
    setSelectedSize(sizes[0]);
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    if (!product) return;

    // Validate size selection when multiple sizes are available
    if (sizes.length > 1 && !selectedSize) {
      setSizeError(true);
      toast.warning(t('product:details.selectSize', { defaultValue: 'Please select a size first' }));
      return;
    }

    await addToCart(Number(product.id), quantity);
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <div className="container px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !product) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{t('common:common.error')}</h2>
            <p className="text-muted-foreground">{error || 'Product not found'}</p>
            <Link to="/shop">
              <Button>{t('product:details.backToShop')}</Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">{t('product:breadcrumb.home')}</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary transition-colors">{t('product:breadcrumb.shop')}</Link>
            <span>/</span>
            <span className="text-foreground">{productName}</span>
          </div>

          <Link to="/shop" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
            <ChevronLeft className="h-4 w-4 me-1" />
            {t('product:details.backToShop')}
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-card-secondary">
                <img
                  src={imageList[currentImage]}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
              {imageList.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {imageList.map((img, idx) => (
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
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{productName}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-muted-foreground">
                      (124 {t('product:details.reviews')})
                    </span>
                  </div>
                  {product.is_active ? (
                    <span className="text-success font-medium">{t('product:details.inStock')}</span>
                  ) : (
                    <span className="text-destructive font-medium">{t('product:details.outOfStock')}</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary">
                {isRTL ? `${product.price.toFixed(2)} ${t('common:common.currency')}` : `${t('common:common.currency')} ${product.price.toFixed(2)}`}
              </div>

              {/* Description */}
              {productDescription && (
                <p className="text-muted-foreground leading-relaxed">{productDescription}</p>
              )}

              {/* Size Selection */}
              <div>
                <h3 className={`font-semibold mb-3 ${sizeError ? 'text-destructive' : ''}`}>
                  {t('product:details.size')}
                  {sizes.length > 1 && <span className="text-destructive ms-1">*</span>}
                </h3>
                <div className={`flex gap-2 flex-wrap p-2 rounded-lg transition-all ${sizeError ? 'ring-2 ring-destructive ring-offset-1' : ''}`}>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : sizeError
                          ? "border-destructive hover:border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-destructive text-sm mt-1">{t('product:details.selectSize', { defaultValue: 'Please select a size' })}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold mb-3">{t('product:details.quantity')}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                  onClick={handleAddToCart}
                  disabled={!product.is_active || isAddingToCart}
                >
                  <ShoppingCart className="h-5 w-5 me-2" />
                  {isAddingToCart ? t('common:common.loading') : t('product:details.addToCart')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{t('product:benefits.freeShipping.title')}</p>
                  <p className="text-xs text-muted-foreground">{t('product:benefits.freeShipping.description')}</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{t('product:benefits.qualityGuarantee.title')}</p>
                  <p className="text-xs text-muted-foreground">{t('product:benefits.qualityGuarantee.description')}</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{t('product:benefits.easyReturns.title')}</p>
                  <p className="text-xs text-muted-foreground">{t('product:benefits.easyReturns.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Required Dialog */}
        <LoginRequiredDialog
          open={showLoginDialog}
          onOpenChange={setShowLoginDialog}
        />
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
