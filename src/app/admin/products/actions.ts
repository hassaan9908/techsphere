"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";
import { connectToDatabase } from "@/lib/db/mongodb";
import { productSchema } from "@/lib/validations/product";
import Product from "@/models/Product";
type ArchiveProductResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };
export type ProductActionState = {
  error?: string;
};

function getProductData(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    price: formData.get("price"),
    discountPrice:
      formData.get("discountPrice") || "",
    stock: formData.get("stock"),
    images: [
      String(formData.get("image") ?? "").trim(),
    ].filter(Boolean),
    specifications: [],
    featured:
      formData.get("featured") === "on",
    isActive:
      formData.get("isActive") === "on",
  };
}

export async function createProduct(
  previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  await requireAdmin();

  const parsed = productSchema.safeParse(
    getProductData(formData)
  );

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Invalid product data.",
    };
  }

  await connectToDatabase();

  const existingProduct = await Product.findOne({
    slug: parsed.data.slug,
  });

  if (existingProduct) {
    return {
      error: "A product with this slug already exists.",
    };
  }

  await Product.create({
  ...parsed.data,
  discountPrice:
    parsed.data.discountPrice ?? null,
});

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}

export async function updateProduct(
  productId: string,
  previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  await requireAdmin();

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return {
      error: "Invalid product ID.",
    };
  }

  const parsed = productSchema.safeParse(
    getProductData(formData)
  );

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Invalid product data.",
    };
  }

  await connectToDatabase();

  const duplicateSlug = await Product.findOne({
    slug: parsed.data.slug,
    _id: {
      $ne: productId,
    },
  });

  if (duplicateSlug) {
    return {
      error: "Another product already uses this slug.",
    };
  }

  const product = await Product.findById(productId);

  if (!product) {
    return {
      error: "Product not found.",
    };
  }

  product.name = parsed.data.name;
  product.slug = parsed.data.slug;
  product.description = parsed.data.description;
  product.brand = parsed.data.brand;
  product.category = parsed.data.category;
  product.price = parsed.data.price;
  product.discountPrice =
  parsed.data.discountPrice ?? null;
  product.stock = parsed.data.stock;
  product.images = parsed.data.images;
  product.specifications =
    parsed.data.specifications;
  product.featured = parsed.data.featured;
  product.isActive = parsed.data.isActive;

  await product.save();

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/admin/products");

  redirect("/admin/products");
}

export async function archiveProduct(
  productId: string
): Promise<ArchiveProductResult> {
  await requireAdmin();

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return {
      success: false,
      error: "Invalid product ID.",
    };
  }

  await connectToDatabase();

  const product = await Product.findById(productId);

  if (!product) {
    return {
      success: false,
      error: "Product not found.",
    };
  }

  product.isActive = false;
  product.featured = false;

  await product.save();

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/admin/products");

  return {
    success: true,
  };
}