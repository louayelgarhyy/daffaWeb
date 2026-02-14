export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface SavedAddress extends Address {
  id: string;
  title: string;
  isDefault: boolean;
  phone?: string;
}

export interface CustomerInfo {
  email: string;
  phone: string;
  name: string;
}

export type PaymentMethod = 'cod' | 'card';
export type ShippingMethod = 'standard' | 'express';

export type OrderStatus =
  | 'processing'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'outForDelivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface TimelineEvent {
  status: OrderStatus;
  date: string | null;
  message: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  estimatedDelivery: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  addressTitle?: string;
  billingAddress?: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  customerInfo: CustomerInfo;
  timeline: TimelineEvent[];
  trackingNumber?: string;
  carrier?: string;
}

export interface CheckoutFormData {
  email: string;
  phone: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
}
