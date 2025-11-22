import { z } from 'zod';

export const checkoutSchema = z.object({
  // Shipping & Payment Methods (only fields actually in the form)
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

// Authentication Schemas

export const loginSchema = z.object({
  countryCode: z
    .string()
    .min(1, 'auth:validation.countryCodeRequired'),

  phone: z
    .string()
    .min(1, 'auth:validation.phoneRequired')
    .regex(/^[3-9]\d{7}$/, 'auth:validation.phoneInvalid'), // Qatar: 8 digits starting with 3-9

  password: z
    .string()
    .min(1, 'auth:validation.passwordRequired')
    .min(8, 'auth:validation.passwordMin'),

  rememberMe: z
    .boolean()
    .optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'auth:validation.nameRequired')
    .min(2, 'auth:validation.nameMin'),

  countryCode: z
    .string()
    .min(1, 'auth:validation.countryCodeRequired'),

  phone: z
    .string()
    .min(1, 'auth:validation.phoneRequired')
    .regex(/^[3-9]\d{7}$/, 'auth:validation.phoneInvalid'), // Qatar: 8 digits starting with 3-9

  password: z
    .string()
    .min(1, 'auth:validation.passwordRequired')
    .min(8, 'auth:validation.passwordMin')
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, 'auth:validation.passwordStrength'),

  confirmPassword: z
    .string()
    .min(1, 'auth:validation.passwordRequired'),

  acceptTerms: z
    .boolean()
    .refine(val => val === true, { message: 'auth:validation.termsRequired' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'auth:validation.passwordMismatch',
  path: ['confirmPassword'],
});

export type SignupFormValues = z.infer<typeof signupSchema>;
