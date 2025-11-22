import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { ChevronLeft, CreditCard, Truck, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { checkoutSchema, CheckoutFormValues } from "@/lib/validations";
import type { Order, CartItem, TimelineEvent, SavedAddress } from "@/types/order";
import { getSavedAddresses, saveAddress } from "@/lib/addressUtils";
import { AddAddressDialog } from "@/components/address/AddAddressDialog";
import { OrderSuccessDialog } from "@/components/OrderSuccessDialog";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/hooks/use-auth";

const Checkout = () => {
  const { t, i18n } = useTranslation(['checkout', 'common']);
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Mock cart items (in real app, would come from context/state management)
  const cartItems: CartItem[] = [
    {
      id: "1",
      name: "Classic Black Abaya",
      price: 89.99,
      quantity: 2,
      size: "M",
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=250&fit=crop"
    },
    {
      id: "2",
      name: "Elegant Navy Abaya",
      price: 94.99,
      quantity: 1,
      size: "L",
      image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=200&h=250&fit=crop"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: 'standard',
      paymentMethod: 'cod',
    },
  });

  const shippingMethod = watch('shippingMethod');
  const shippingCost = shippingMethod === 'express' ? 20 : 0;
  const total = subtotal + shippingCost;

  // Load saved addresses on mount
  useEffect(() => {
    const addresses = getSavedAddresses();
    setSavedAddresses(addresses);

    // Auto-select default address if available
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, []);

  // Handle address selection
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  // Handle new address addition from dialog
  const handleAddAddress = (addressData: Omit<SavedAddress, 'id'>) => {
    // Save the new address
    const newAddress = saveAddress(addressData);

    // Reload saved addresses
    const updatedAddresses = getSavedAddresses();
    setSavedAddresses(updatedAddresses);

    // Auto-select the newly added address
    setSelectedAddressId(newAddress.id);

    // Show success message
    toast.success(t('common:addresses.addedSuccess'));
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    // Validate that an address is selected
    if (!selectedAddressId) {
      toast.error(t('checkout:validation.addressRequired', { defaultValue: 'Please select or add a shipping address' }));
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate order ID
    const orderId = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;
    const orderNumber = orderId;
    const currentDate = new Date().toISOString();
    const estimatedDelivery = new Date(Date.now() + (shippingMethod === 'express' ? 2 : 5) * 24 * 60 * 60 * 1000).toISOString();

    // Create timeline events
    const timeline: TimelineEvent[] = [
      {
        status: 'confirmed',
        date: currentDate,
        message: t('order:timeline.orderPlaced'),
        description: t('order:timeline.orderPlacedDesc'),
        completed: true,
      },
      {
        status: 'processing',
        date: currentDate,
        message: t('order:timeline.orderConfirmed'),
        description: t('order:timeline.orderConfirmedDesc'),
        completed: true,
      },
      {
        status: 'preparing',
        date: null,
        message: t('order:timeline.preparing'),
        description: t('order:timeline.preparingDesc'),
        completed: false,
      },
      {
        status: 'shipped',
        date: null,
        message: t('order:timeline.shipped'),
        description: t('order:timeline.shippedDesc'),
        completed: false,
      },
      {
        status: 'delivered',
        date: null,
        message: t('order:timeline.delivered'),
        description: t('order:timeline.deliveredDesc'),
        completed: false,
      },
    ];

    // Get the selected address
    const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);

    // This should never happen due to validation above, but TypeScript safety
    if (!selectedAddress) {
      toast.error(t('checkout:validation.addressRequired', { defaultValue: 'Please select or add a shipping address' }));
      setIsProcessing(false);
      return;
    }

    // Create order object using the selected saved address
    const order: Order = {
      id: orderId,
      orderNumber,
      date: currentDate,
      status: 'processing',
      estimatedDelivery,
      items: cartItems,
      subtotal,
      shipping: shippingCost,
      discount: 0,
      total,
      shippingAddress: {
        fullName: selectedAddress.fullName,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2,
        city: selectedAddress.city,
        region: selectedAddress.region,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
      },
      addressTitle: selectedAddress.title,
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'paid',
      customerInfo: {
        email: '',
        phone: user ? `${user.countryCode}${user.phone}` : '',
        name: selectedAddress.fullName,
      },
      timeline,
    };

    // Store order in localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart (in real app)
    // localStorage.removeItem('cart');

    setIsProcessing(false);

    // Store order ID and show success dialog
    setCurrentOrderId(orderId);
    setShowSuccessDialog(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="bg-card-secondary py-8 border-b border-border">
        <div className="container px-4">
          <Link to="/cart" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
            <ChevronLeft className="h-4 w-4 me-1" />
            {t('checkout:actions.backToCart')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t('checkout:title')}</h1>
        </div>
      </div>

      <div className="container px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Saved Addresses or Add Address Button */}
              {savedAddresses.length > 0 ? (
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">{t('checkout:savedAddresses.title')}</h2>
                    <Link to="/addresses" className="text-sm text-primary hover:underline flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {t('common:accountMenu.myAddresses')}
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {savedAddresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => handleAddressSelect(address.id)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedAddressId === address.id
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            selectedAddressId === address.id
                              ? 'border-primary bg-primary'
                              : 'border-border'
                          }`}>
                            {selectedAddressId === address.id && (
                              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{address.title}</h3>
                              {address.isDefault && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                  {t('common:addresses.default')}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {address.fullName} • {address.addressLine1}, {address.city}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">{t('checkout:savedAddresses.noAddresses')}</h2>
                    <p className="text-sm text-muted-foreground mb-6 text-center">
                      {t('checkout:savedAddresses.noAddressesDesc')}
                    </p>
                    <Button
                      type="button"
                      onClick={() => setIsAddAddressDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {t('checkout:savedAddresses.addAddress')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Shipping Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">{t('checkout:shippingMethod.title')}</h2>
                <RadioGroup
                  defaultValue="standard"
                  onValueChange={(value) => setValue('shippingMethod', value as 'standard' | 'express')}
                >
                  <div className="flex items-start space-x-3 space-y-0 rounded-lg border border-border p-4 hover:bg-card-secondary cursor-pointer">
                    <RadioGroupItem value="standard" id="standard" />
                    <div className="flex-1 flex items-start justify-between">
                      <div>
                        <Label htmlFor="standard" className="font-semibold cursor-pointer flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          {t('checkout:shippingMethod.standard')}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('checkout:shippingMethod.standardDesc')}
                        </p>
                      </div>
                      <span className="font-semibold text-success">
                        {t('checkout:shippingMethod.standardPrice')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-y-0 rounded-lg border border-border p-4 hover:bg-card-secondary cursor-pointer mt-4">
                    <RadioGroupItem value="express" id="express" />
                    <div className="flex-1 flex items-start justify-between">
                      <div>
                        <Label htmlFor="express" className="font-semibold cursor-pointer flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          {t('checkout:shippingMethod.express')}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('checkout:shippingMethod.expressDesc')}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {t('checkout:shippingMethod.expressPrice')}
                      </span>
                    </div>
                  </div>
                </RadioGroup>
                {errors.shippingMethod && (
                  <p className="text-sm text-destructive mt-2">{t(errors.shippingMethod.message as string)}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">{t('checkout:payment.title')}</h2>
                <RadioGroup
                  defaultValue="cod"
                  onValueChange={(value) => setValue('paymentMethod', value as 'cod' | 'card')}
                >
                  <div className="flex items-start space-x-3 space-y-0 rounded-lg border border-border p-4 hover:bg-card-secondary cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <div className="flex-1">
                      <Label htmlFor="cod" className="font-semibold cursor-pointer flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        {t('checkout:payment.cod')}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('checkout:payment.codDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-y-0 rounded-lg border border-border p-4 opacity-50 mt-4">
                    <RadioGroupItem value="card" id="card" disabled />
                    <div className="flex-1">
                      <Label htmlFor="card" className="font-semibold flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {t('checkout:payment.card')}
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{t('checkout:payment.cardDesc')}</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('checkout:payment.cardDisabled')}
                      </p>
                    </div>
                  </div>
                </RadioGroup>
                {errors.paymentMethod && (
                  <p className="text-sm text-destructive mt-2">{t(errors.paymentMethod.message as string)}</p>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold text-foreground mb-6">{t('checkout:orderSummary.title')}</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-20 rounded overflow-hidden bg-card-secondary flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {isRTL ? `${item.price.toFixed(2)} ${t('common:common.currency')}` : `${t('common:common.currency')} ${item.price.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('checkout:orderSummary.subtotal')}</span>
                    <span className="font-semibold">
                      {isRTL ? `${subtotal.toFixed(2)} ${t('common:common.currency')}` : `${t('common:common.currency')} ${subtotal.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('checkout:orderSummary.shipping')}</span>
                    <span className="font-semibold">
                      {shippingCost === 0
                        ? t('checkout:orderSummary.free')
                        : isRTL
                          ? `${shippingCost.toFixed(2)} ${t('common:common.currency')}`
                          : `${t('common:common.currency')} ${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-base font-bold">
                    <span>{t('checkout:orderSummary.total')}</span>
                    <span className="text-primary">
                      {isRTL ? `${total.toFixed(2)} ${t('common:common.currency')}` : `${t('common:common.currency')} ${total.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full mt-6 bg-primary hover:bg-primary-hover text-primary-foreground"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? t('checkout:actions.processing') : t('checkout:actions.placeOrder')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Add Address Dialog */}
      <AddAddressDialog
        open={isAddAddressDialogOpen}
        onOpenChange={setIsAddAddressDialogOpen}
        onSubmit={handleAddAddress}
      />

      {/* Order Success Dialog */}
      <OrderSuccessDialog
        open={showSuccessDialog}
        orderId={currentOrderId}
        onClose={() => {
          setShowSuccessDialog(false);
          if (currentOrderId) {
            navigate(`/order-confirmation/${currentOrderId}`);
          }
        }}
      />
    </div>
    </PageTransition>
  );
};

export default Checkout;
