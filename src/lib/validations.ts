import { z } from 'zod';

export const checkoutSchema = z.object({
  // Contact Information
  email: z
    .string()
    .min(1, 'checkout:validation.emailRequired')
    .email('checkout:validation.emailInvalid'),

  phone: z
    .string()
    .min(1, 'checkout:validation.phoneRequired')
    .regex(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'checkout:validation.phoneInvalid'),

  // Shipping Address
  fullName: z
    .string()
    .min(1, 'checkout:validation.nameRequired')
    .min(2, 'checkout:validation.nameMin'),

  addressLine1: z
    .string()
    .min(1, 'checkout:validation.addressRequired'),

  addressLine2: z
    .string()
    .optional(),

  city: z
    .string()
    .min(1, 'checkout:validation.cityRequired'),

  region: z
    .string()
    .min(1, 'checkout:validation.regionRequired'),

  postalCode: z
    .string()
    .min(1, 'checkout:validation.postalCodeRequired'),

  country: z
    .string()
    .min(1, 'checkout:validation.countryRequired'),

  // Shipping & Payment Methods
  shippingMethod: z
    .enum(['standard', 'express'], {
      required_error: 'checkout:validation.shippingMethodRequired',
    }),

  paymentMethod: z
    .enum(['cod', 'card'], {
      required_error: 'checkout:validation.paymentMethodRequired',
    }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
