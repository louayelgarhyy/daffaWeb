import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { LoginRequiredDialog } from "@/components/LoginRequiredDialog";
import { subcategories } from "@/data/subcategories";
import { Badge } from "@/components/ui/badge";
import type { ApiProduct } from "@/lib/api/types";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  categoryId?: string;
  subcategoryId?: string;
  delay?: number;
  productData?: ApiProduct; // raw product data to pass via navigation state
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  rating = 0,
  reviews = 0,
  discount,
  subcategoryId,
  productData,
}: ProductCardProps) => {
  const { t, i18n } = useTranslation('common');
  const { isAuthenticated } = useAuth();
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const isRTL = i18n.language === 'ar';

  // Get subcategory name for badge
  const subcategory = subcategoryId
    ? subcategories.find(sub => sub.id === subcategoryId)
    : null;
  const subcategoryName = subcategory
    ? (isRTL ? subcategory.nameAr : subcategory.name)
    : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    const productId = parseInt(id, 10);
    if (!isNaN(productId)) {
      await addToCart(productId, 1);
    }
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/product/${id}`, { state: { product: productData } });
  };

  return (
    <Card className="group relative overflow-hidden border border-border hover:shadow-md transition-all duration-300 bg-card">
      <div onClick={handleNavigate} className="cursor-pointer">
        <div className="relative h-[17rem] overflow-hidden bg-card-secondary">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount && (
            <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold`}>
              -{discount}%
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors ${
              isLiked ? "text-destructive" : "text-foreground hover:text-destructive"
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div onClick={handleNavigate} className="cursor-pointer">
          <h3 className="font-semibold text-foreground group-hover:text-foreground/70 transition-colors">
            {name}
          </h3>
        </div>

        {subcategoryName && (
          <Badge variant="secondary" className="text-xs">
            {subcategoryName}
          </Badge>
        )}

        {rating > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-muted-foreground">({reviews})</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {discount ? (
              <>
                <p className="text-lg font-bold text-foreground">
                  {isRTL ? `${(price * (1 - discount / 100)).toFixed(2)} ${t('common.currency')}` : `${t('common.currency')} ${(price * (1 - discount / 100)).toFixed(2)}`}
                </p>
                <p className="text-sm text-muted-foreground line-through">
                  {isRTL ? `${price.toFixed(2)} ${t('common.currency')}` : `${t('common.currency')} ${price.toFixed(2)}`}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-foreground">
                {isRTL ? `${price.toFixed(2)} ${t('common.currency')}` : `${t('common.currency')} ${price.toFixed(2)}`}
              </p>
            )}
          </div>

          <Button
            size="icon"
            className="bg-foreground hover:bg-foreground/90 text-background rounded-full transition-colors"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </Card>
  );
};
