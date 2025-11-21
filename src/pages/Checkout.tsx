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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { checkoutSchema, CheckoutFormValues } from "@/lib/validations";
import type { Order, CartItem, TimelineEvent, SavedAddress } from "@/types/order";
import { getSavedAddresses, saveAddress } from "@/lib/addressUtils";

const Checkout = () => {
  const { t, i18n } = useTranslation(['checkout', 'common']);
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveThisAddress, setSaveThisAddress] = useState(false);

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
      country: 'sa',
    },
  });

  const shippingMethod = watch('shippingMethod');
  const shippingCost = shippingMethod === 'express' ? 20 : 0;
  const total = subtotal + shippingCost;

  // Load saved addresses on mount
  useEffect(() => {
    const addresses = getSavedAddresses();
    setSavedAddresses(addresses);

    // Auto-select default address if available and no address is selected yet
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress && !selectedAddressId && !useNewAddress) {
      setSelectedAddressId(defaultAddress.id);
      prefillAddressForm(defaultAddress);
    }
  }, []);

  // Pre-fill form when an address is selected
  const prefillAddressForm = (address: SavedAddress) => {
    setValue('fullName', address.fullName);
    setValue('addressLine1', address.addressLine1);
    setValue('addressLine2', address.addressLine2 || '');
    setValue('city', address.city);
    setValue('region', address.region);
    setValue('postalCode', address.postalCode);
    setValue('country', address.country);
  };

  // Handle address selection
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      prefillAddressForm(address);
    }
  };

  // Handle "use new address" selection
  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    setUseNewAddress(true);
    // Clear form
    setValue('fullName', '');
    setValue('addressLine1', '');
    setValue('addressLine2', '');
    setValue('city', '');
    setValue('region', '');
    setValue('postalCode', '');
    setValue('country', 'sa');
  };

  const onSubmit = async (data: CheckoutFormValues) => {
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

    // Get address title if a saved address was selected
    const selectedAddress = selectedAddressId ? savedAddresses.find(addr => addr.id === selectedAddressId) : null;

    // Save new address if user checked the box
    if (saveThisAddress && useNewAddress) {
      saveAddress({
        title: 'Address ' + (savedAddresses.length + 1), // Default title
        fullName: data.fullName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        region: data.region,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: savedAddresses.length === 0, // Set as default if it's the first address
      });
    }

    // Create order object
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
        fullName: data.fullName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        region: data.region,
        postalCode: data.postalCode,
        country: data.country,
      },
      addressTitle: selectedAddress?.title, // Include address title if selected
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'paid',
      customerInfo: {
        email: data.email,
        phone: data.phone,
        name: data.fullName,
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
    toast.success(t('order:confirmation.title'));

    // Navigate to order confirmation
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
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
              {/* Contact Information */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">{t('checkout:contact.title')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('checkout:contact.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('checkout:contact.emailPlaceholder')}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{t(errors.email.message as string)}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('checkout:contact.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('checkout:contact.phonePlaceholder')}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{t(errors.phone.message as string)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
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

                  <button
                    type="button"
                    onClick={handleUseNewAddress}
                    className={`w-full mt-3 border rounded-lg p-4 text-start transition-all ${
                      useNewAddress
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        useNewAddress ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {useNewAddress && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">{t('checkout:savedAddresses.useNewAddress')}</span>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">{t('checkout:shipping.title')}</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('checkout:shipping.fullName')}</Label>
                    <Input
                      id="fullName"
                      placeholder={t('checkout:shipping.fullNamePlaceholder')}
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{t(errors.fullName.message as string)}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">{t('checkout:shipping.country')}</Label>
                      <Select
                        defaultValue="sa"
                        onValueChange={(value) => setValue('country', value)}
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder={t('checkout:shipping.countryPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sa">{t('checkout:countries.sa')}</SelectItem>
                          <SelectItem value="ae">{t('checkout:countries.ae')}</SelectItem>
                          <SelectItem value="kw">{t('checkout:countries.kw')}</SelectItem>
                          <SelectItem value="qa">{t('checkout:countries.qa')}</SelectItem>
                          <SelectItem value="bh">{t('checkout:countries.bh')}</SelectItem>
                          <SelectItem value="om">{t('checkout:countries.om')}</SelectItem>
                          <SelectItem value="jo">{t('checkout:countries.jo')}</SelectItem>
                          <SelectItem value="eg">{t('checkout:countries.eg')}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.country && (
                        <p className="text-sm text-destructive">{t(errors.country.message as string)}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">{t('checkout:shipping.city')}</Label>
                      <Input
                        id="city"
                        placeholder={t('checkout:shipping.cityPlaceholder')}
                        {...register('city')}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{t(errors.city.message as string)}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">{t('checkout:shipping.addressLine1')}</Label>
                    <Input
                      id="addressLine1"
                      placeholder={t('checkout:shipping.addressLine1Placeholder')}
                      {...register('addressLine1')}
                    />
                    {errors.addressLine1 && (
                      <p className="text-sm text-destructive">{t(errors.addressLine1.message as string)}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">{t('checkout:shipping.addressLine2')}</Label>
                    <Input
                      id="addressLine2"
                      placeholder={t('checkout:shipping.addressLine2Placeholder')}
                      {...register('addressLine2')}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region">{t('checkout:shipping.region')}</Label>
                      <Input
                        id="region"
                        placeholder={t('checkout:shipping.regionPlaceholder')}
                        {...register('region')}
                      />
                      {errors.region && (
                        <p className="text-sm text-destructive">{t(errors.region.message as string)}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t('checkout:shipping.postalCode')}</Label>
                      <Input
                        id="postalCode"
                        placeholder={t('checkout:shipping.postalCodePlaceholder')}
                        {...register('postalCode')}
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-destructive">{t(errors.postalCode.message as string)}</p>
                      )}
                    </div>
                  </div>

                  {/* Save address checkbox - only show when using new address */}
                  {useNewAddress && (
                    <div className="flex items-center space-x-2 pt-4 border-t border-border">
                      <Checkbox
                        id="saveAddress"
                        checked={saveThisAddress}
                        onCheckedChange={(checked) => setSaveThisAddress(checked as boolean)}
                      />
                      <Label htmlFor="saveAddress" className="text-sm font-normal cursor-pointer">
                        {t('checkout:savedAddresses.saveThisAddress')}
                      </Label>
                    </div>
                  )}
                </div>
              </div>

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
    </div>
  );
};

export default Checkout;
