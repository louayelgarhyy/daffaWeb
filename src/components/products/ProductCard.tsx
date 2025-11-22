import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { LoginRequiredDialog } from "@/components/LoginRequiredDialog";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  discount?: number;
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  rating = 0,
  reviews = 0,
  discount,
}: ProductCardProps) => {
  const { t, i18n } = useTranslation('common');
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const isRTL = i18n.language === 'ar';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    // Add to cart functionality (to be fully implemented)
    toast.success(t('buttons.addToCart', { defaultValue: 'Added to cart!' }));
  };

  return (
    <Card className="group relative overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <Link to={`/product/${id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-card-secondary">
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
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors ${
              isLiked ? "text-destructive" : "text-foreground hover:text-destructive"
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

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
                <p className="text-lg font-bold text-primary">
                  {isRTL ? `${(price * (1 - discount / 100)).toFixed(2)} ${t('common.currency')}` : `${t('common.currency')} ${(price * (1 - discount / 100)).toFixed(2)}`}
                </p>
                <p className="text-sm text-muted-foreground line-through">
                  {isRTL ? `${price.toFixed(2)} ${t('common.currency')}` : `${t('common.currency')} ${price.toFixed(2)}`}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-primary">
                {isRTL ? `${price.toFixed(2)} ${t('common.currency')}` : `${t('common.currency')} ${price.toFixed(2)}`}
              </p>
            )}
          </div>

          <Button
            size="icon"
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full"
            onClick={handleAddToCart}
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
