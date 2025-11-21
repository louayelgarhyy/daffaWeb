import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Package,
  MapPin,
  CreditCard,
  User,
  Download,
  Printer,
  HelpCircle,
  Check,
  Circle,
  ChevronLeft,
  Phone,
  Mail,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types/order";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, i18n } = useTranslation(['order', 'common', 'checkout']);
  const isRTL = i18n.language === 'ar';

  // Get order from localStorage
  const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <Package className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground">{t('order:notFound.title')}</h2>
          <p className="text-muted-foreground">{t('order:notFound.message')}</p>
          <Link to="/shop">
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              {t('order:notFound.backToShop')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      processing: 'secondary',
      confirmed: 'default',
      preparing: 'default',
      shipped: 'default',
      outForDelivery: 'default',
      delivered: 'default',
      cancelled: 'destructive',
      refunded: 'secondary',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {t(`order:status.${status}`)}
      </Badge>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card-secondary py-8 border-b border-border">
        <div className="container px-4">
          <Link to="/" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
            <ChevronLeft className="h-4 w-4 me-1" />
            {t('common:nav.home')}
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {t('order:details.orderNumber', { number: order.orderNumber })}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('order:details.placedOn', { date: formatDate(order.date) })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">{t('order:timeline.title')}</h2>
              </div>

              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.completed
                            ? 'bg-success text-success-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {event.completed ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-16 ${event.completed ? 'bg-success' : 'bg-border'}`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className={`font-semibold ${
                              event.completed ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {event.message}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        </div>
                        {event.date && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap ms-4">
                            {formatDate(event.date)}
                          </span>
                        )}
                      </div>
                      {!event.completed && !event.date && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {t('order:timeline.expectedDate', {
                            date: formatDate(order.estimatedDelivery),
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">{t('order:items.title')}</h2>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-20 h-24 rounded overflow-hidden bg-card-secondary flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('order:items.size')}: {item.size}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('order:items.quantity')}: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-2">
                        {isRTL
                          ? `${item.price.toFixed(2)} ${t('common:common.currency')}`
                          : `${t('common:common.currency')} ${item.price.toFixed(2)}`}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="font-bold text-foreground">
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shipping Address */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">
                  {order.addressTitle
                    ? `${t('order:shipping.title')} (${order.addressTitle})`
                    : t('order:shipping.title')}
                </h3>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-foreground">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-muted-foreground">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.region}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground pt-2">
                  <span className="font-semibold text-foreground">{t('order:shipping.method')}:</span>{' '}
                  {order.shippingMethod === 'standard'
                    ? t('checkout:shippingMethod.standard')
                    : t('checkout:shippingMethod.express')}
                </p>
                {order.trackingNumber && (
                  <p className="text-muted-foreground pt-2">
                    <span className="font-semibold text-foreground">{t('order:shipping.trackingNumber')}:</span>{' '}
                    {order.trackingNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">{t('order:payment.title')}</h3>
              </div>
              <div className="text-sm space-y-2">
                <p>
                  <span className="text-muted-foreground">{t('order:payment.method')}:</span>{' '}
                  <span className="font-semibold text-foreground">
                    {order.paymentMethod === 'cod' ? t('order:payment.cod') : t('order:payment.card')}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">{t('order:payment.status')}:</span>{' '}
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === 'paid' ? 'text-success' : 'text-warning'
                    }`}
                  >
                    {order.paymentStatus === 'paid' ? t('order:payment.paid') : t('order:payment.pending')}
                  </span>
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">{t('order:customer.title')}</h3>
              </div>
              <div className="text-sm space-y-2">
                <p>
                  <span className="text-muted-foreground">{t('order:customer.name')}:</span>{' '}
                  <span className="font-semibold text-foreground">{order.customerInfo.name}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">{t('order:customer.email')}:</span>{' '}
                  <span className="text-foreground">{order.customerInfo.email}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">{t('order:customer.phone')}:</span>{' '}
                  <span className="text-foreground">{order.customerInfo.phone}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 print:hidden">
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 me-2" />
                {t('order:actions.printOrder')}
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 me-2" />
                {t('order:actions.downloadInvoice')}
              </Button>
            </div>

            {/* Support */}
            <div className="bg-card-secondary border border-border rounded-lg p-6 print:hidden">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">{t('order:support.title')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t('order:support.description')}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-foreground">+966 12 345 6789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-foreground">support@daffaabayat.com</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                {t('order:actions.contactSupport')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
