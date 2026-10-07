import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Product name is required.")
      .max(120, "Product name is too long."),

    slug: z
      .string()
      .trim()
      .min(2, "Slug is required.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain lowercase letters, numbers, and hyphens only."
      ),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters."),

    brand: z
      .string()
      .trim()
      .min(1, "Brand is required."),

    category: z.enum([
      "smartphones",
      "laptops",
      "accessories",
    ]),

    price: z.coerce
      .number()
      .min(0, "Price cannot be negative."),

    discountPrice: z.preprocess(
      (value) => {
        if (
          value === "" ||
          value === null ||
          value === undefined
        ) {
          return undefined;
        }

        return value;
      },
      z.coerce
        .number()
        .min(0, "Discount price cannot be negative.")
        .optional()
    ),

    stock: z.coerce
      .number()
      .int("Stock must be a whole number.")
      .min(0, "Stock cannot be negative."),

    images: z.array(z.string().url()).default([]),

    specifications: z
      .array(
        z.object({
          key: z.string().trim().min(1),
          value: z.string().trim().min(1),
        })
      )
      .default([]),

    featured: z.boolean().default(false),

    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (
      data.discountPrice !== undefined &&
      data.discountPrice >= data.price
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPrice"],
        message:
          "Discount price must be lower than the original price.",
      });
    }
  });

export type ProductInput = z.infer<
  typeof productSchema
>;