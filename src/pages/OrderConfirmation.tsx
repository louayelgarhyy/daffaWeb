import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Package, Printer, ShoppingBag } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types/order";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, i18n } = useTranslation(['order', 'common']);
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  // Get order from localStorage
  const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-12">
        {/* Success Icon & Message */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('order:confirmation.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {t('order:confirmation.subtitle')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('order:confirmation.checkEmail', { email: order.customerInfo.email })}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg overflow-hidden">
          {/* Order Info Header */}
          <div className="bg-card-secondary p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('order:confirmation.orderNumber')}
                </p>
                <p className="font-bold text-foreground">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('order:confirmation.orderDate')}
                </p>
                <p className="font-semibold text-foreground">{formatDate(order.date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('order:confirmation.estimatedDelivery')}
                </p>
                <p className="font-semibold text-primary">{formatDate(order.estimatedDelivery)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                {t('order:items.title')}
              </h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 rounded overflow-hidden bg-card-secondary flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('order:items.size')}: {item.size} | {t('order:items.quantity')}: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {isRTL
                        ? `${(item.price * item.quantity).toFixed(2)} ${t('common:common.currency')}`
                        : `${t('common:common.currency')} ${(item.price * item.quantity).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('order:summary.subtotal')}</span>
                <span className="font-semibold">
                  {isRTL
                    ? `${order.subtotal.toFixed(2)} ${t('common:common.currency')}`
                    : `${t('common:common.currency')} ${order.subtotal.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('order:summary.shipping')}</span>
                <span className="font-semibold">
                  {order.shipping === 0
                    ? t('order:summary.free')
                    : isRTL
                      ? `${order.shipping.toFixed(2)} ${t('common:common.currency')}`
                      : `${t('common:common.currency')} ${order.shipping.toFixed(2)}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('order:summary.discount')}</span>
                  <span className="font-semibold text-success">
                    -{isRTL
                      ? `${order.discount.toFixed(2)} ${t('common:common.currency')}`
                      : `${t('common:common.currency')} ${order.discount.toFixed(2)}`}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>{t('order:summary.total')}</span>
                <span className="text-primary">
                  {isRTL
                    ? `${order.total.toFixed(2)} ${t('common:common.currency')}`
                    : `${t('common:common.currency')} ${order.total.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div className="p-6 bg-card-secondary/50">
            <h3 className="font-bold text-foreground mb-3">
              {order.addressTitle
                ? `${t('order:shipping.title')} (${order.addressTitle})`
                : t('order:shipping.title')}
            </h3>
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-foreground">{t('order:shipping.method')}:</span>{' '}
                {order.shippingMethod === 'standard'
                  ? t('checkout:shippingMethod.standard')
                  : t('checkout:shippingMethod.express')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="p-6">
            <h3 className="font-bold text-foreground mb-3">{t('order:payment.title')}</h3>
            <div className="text-sm">
              <p>
                <span className="text-muted-foreground">{t('order:payment.method')}:</span>{' '}
                <span className="font-semibold">
                  {order.paymentMethod === 'cod' ? t('order:payment.cod') : t('order:payment.card')}
                </span>
              </p>
              <p className="mt-1">
                <span className="text-muted-foreground">{t('order:payment.status')}:</span>{' '}
                <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}`}>
                  {order.paymentStatus === 'paid' ? t('order:payment.paid') : t('order:payment.pending')}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-3xl mx-auto mt-8 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <Link to={`/order/${order.id}`}>
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground">
              <Package className="h-5 w-5 me-2" />
              {t('order:confirmation.actions.viewDetails')}
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            onClick={handlePrint}
            className="w-full sm:w-auto"
          >
            <Printer className="h-5 w-5 me-2" />
            {t('order:confirmation.actions.printReceipt')}
          </Button>

          <Link to="/shop">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <ShoppingBag className="h-5 w-5 me-2" />
              {t('order:confirmation.actions.continueShopping')}
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="max-w-3xl mx-auto mt-12 text-center text-sm text-muted-foreground print:hidden">
          <p>{t('order:support.description')}</p>
          <p className="mt-2">
            {t('order:support.phone', { phone: '+966 12 345 6789' })} | {' '}
            {t('order:support.email', { email: 'support@daffaabayat.com' })}
          </p>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default OrderConfirmation;
