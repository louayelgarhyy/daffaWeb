import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const Cart = () => {
  const { t, i18n } = useTranslation(['cart', 'common']);
  const isRTL = i18n.language === 'ar';
  const { isAuthenticated } = useAuth();
  const { 
    items, 
    total, 
    isLoading, 
    increaseQuantity, 
    decreaseQuantity, 
    removeItem 
  } = useCart();

  // Calculate subtotal and shipping
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const grandTotal = subtotal + shipping;

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">{t('cart:empty.title')}</h2>
            <p className="text-muted-foreground">
              {t('auth:loginRequired.message', { defaultValue: 'Please login to view your cart' })}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  {t('auth:loginRequired.loginButton', { defaultValue: 'Login' })}
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline">
                  {t('cart:empty.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Loading state
  if (isLoading && items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <div className="bg-card-secondary py-12 border-b border-border">
            <div className="container px-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-5 w-32 mt-2" />
            </div>
          </div>
          <div className="container px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                    <Skeleton className="w-24 h-32 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">{t('cart:empty.title')}</h2>
            <p className="text-muted-foreground">{t('cart:empty.description')}</p>
            <Link to="/shop">
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                {t('cart:empty.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="bg-card-secondary py-12 border-b border-border">
          <div className="container px-4">
            <h1 className="text-4xl font-bold text-foreground">{t('cart:title')}</h1>
            <p className="text-muted-foreground mt-2">{t('cart:itemCount', { count: items.length })}</p>
          </div>
        </div>

        <div className="container px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.product;
                const productName = product?.name || 'Product';
                const productImage = product?.image 
                  ? (product.image.startsWith('http') ? product.image : `https://appdaffah.com/${product.image}`)
                  : 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=250&fit=crop';
                const productPrice = product?.price || 0;
                
                return (
                  <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-24 h-32 object-cover rounded-lg bg-card-secondary"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground">{productName}</h3>
                      <p className="text-sm text-muted-foreground">{t('cart:item.size')}</p>
                      <p className="text-lg font-bold text-primary">
                        {isRTL ? `${productPrice.toFixed(2)} ${t('common:common.currency')}` : `${t('common:common.currency')} ${productPrice.toFixed(2)}`}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => increaseQuantity(item.id)}
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        {isRTL 
                          ? `${(productPrice * item.quantity).toFixed(2)} ${t('common:common.currency')}`
                          : `${t('common:common.currency')} ${(productPrice * item.quantity).toFixed(2)}`
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold text-foreground mb-6">{t('cart:summary.orderSummary')}</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('cart:summary.subtotal')}</span>
                    <span className="font-semibold">
                      {isRTL ? `${subtotal.toFixed(2)} ${t('common:common.currency')}` : `${t('common:common.currency')} ${subtotal.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('cart:summary.shipping')}</span>
                    <span className="font-semibold">
                      {shipping === 0
                        ? t('cart:summary.free')
                        : isRTL
                          ? `${shipping.toFixed(2)} ${t('common:common.currency')}`
                          : `${t('common:common.currency')} ${shipping.toFixed(2)}`
                      }
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-success">{t('cart:summary.freeShippingAchieved')}</p>
                  )}
                  {subtotal > 0 && subtotal < 100 && (
                    <p className="text-xs text-muted-foreground">
                      {t('cart:summary.freeShippingRemaining', { amount: (100 - subtotal).toFixed(2) })}
                    </p>
                  )}
                  <div className="border-t border-border pt-4 flex justify-between text-lg font-bold text-foreground">
                    <span>{t('cart:summary.total')}</span>
                    <span>
                      {isRTL ? `${grandTotal.toFixed(2)} ${t('common:common.currency')}` : `${t('common:common.currency')} ${grandTotal.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground mb-3">
                    {t('cart:summary.proceedToCheckout')}
                  </Button>
                </Link>

                <Link to="/shop">
                  <Button variant="outline" className="w-full">
                    {t('cart:actions.continueShopping')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
