import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import type { ApiOrderStatus } from "@/lib/api/types";

const MyOrders = () => {
  const { t, i18n } = useTranslation(['common', 'order']);
  const isRTL = i18n.language === 'ar';
  const { orders, isLoading, page, totalPages, loadMore } = useOrders();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: ApiOrderStatus) => {
    const variants: Record<ApiOrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      processing: 'default',
      delivering: 'default',
      completed: 'default',
      canceled: 'destructive',
      user_canceled: 'destructive',
    };

    // Map API status to translation key
    const statusMap: Record<ApiOrderStatus, string> = {
      pending: 'processing',
      confirmed: 'confirmed',
      processing: 'preparing',
      delivering: 'shipped',
      completed: 'delivered',
      canceled: 'cancelled',
      user_canceled: 'cancelled',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {t(`order:status.${statusMap[status] || status}`)}
      </Badge>
    );
  };

  // Loading state
  if (isLoading && orders.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <div className="bg-card-secondary py-12 border-b border-border">
            <div className="container px-4">
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
          <div className="container px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (orders.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <div className="bg-card-secondary py-12 border-b border-border">
            <div className="container px-4">
              <h1 className="text-4xl font-bold text-foreground">{t('common:myOrders.title')}</h1>
            </div>
          </div>

          <div className="container px-4 py-16">
            <div className="max-w-md mx-auto text-center space-y-4">
              <Package className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-bold text-foreground">{t('common:myOrders.noOrders')}</h2>
              <p className="text-muted-foreground">{t('common:myOrders.noOrdersDesc')}</p>
              <Link to="/shop">
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground mt-4">
                  <ShoppingBag className="h-5 w-5 me-2" />
                  {t('common:buttons.shopNow')}
                </Button>
              </Link>
            </div>
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
            <h1 className="text-4xl font-bold text-foreground">{t('common:myOrders.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {orders.length} {orders.length === 1 ? t('order:confirmation.orderNumber') : t('order:items.title')}
            </p>
          </div>
        </div>

        <div className="container px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/order/${order.id}`}
                className="block group"
              >
                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {t('order:details.orderNumber', { number: order.order_number })}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t('common:myOrders.orderPlaced')} {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Items Preview */}
                      {order.items && order.items.length > 0 && (
                        <div className="flex gap-2 overflow-hidden">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-16 rounded overflow-hidden bg-card-secondary flex-shrink-0"
                            >
                              {item.product?.images?.[0]?.url ? (
                                <img
                                  src={item.product.images[0].url}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                  {item.product_name.charAt(0)}
                                </div>
                              )}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-16 rounded bg-card-secondary flex items-center justify-center text-xs text-muted-foreground font-semibold">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground">
                        {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'} • {' '}
                        <span className="font-semibold text-foreground">
                          {isRTL
                            ? `${order.total.toFixed(2)} ${t('common:common.currency')}`
                            : `${t('common:common.currency')} ${order.total.toFixed(2)}`}
                        </span>
                      </p>
                    </div>

                    {/* Status & Action */}
                    <div className="flex md:flex-col items-center md:items-end gap-3">
                      {getStatusBadge(order.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        {t('common:myOrders.viewDetails')}
                        <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Load More */}
            {page < totalPages && (
              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={loadMore}
                  disabled={isLoading}
                >
                  {isLoading ? t('common:common.loading') : t('common:buttons.loadMore')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MyOrders;
