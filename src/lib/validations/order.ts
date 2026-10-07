import { z } from "zod";

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required."),

  email: z
    .string()
    .trim()
    .email("Valid email is required."),

  phone: z
    .string()
    .trim()
    .min(7, "Valid phone number is required."),

  address: z
    .string()
    .trim()
    .min(5, "Shipping address is required."),

  city: z
    .string()
    .trim()
    .min(2, "City is required."),

  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code is required."),

  country: z
    .string()
    .trim()
    .min(2, "Country is required."),

  paymentMethod: z.literal("cod"),

  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Your cart is empty."),
});

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export type CheckoutInput = z.infer<
  typeof checkoutSchema
>;

export type OrderStatus = z.infer<
  typeof orderStatusSchema
>;