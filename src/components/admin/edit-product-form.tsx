"use client";

import { useActionState } from "react";
import { ProductSubmitButton } from "@/components/admin/product-submit-button";
import {
  updateProduct,
  type ProductActionState,
} from "@/app/admin/products/actions";


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditProductFormProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    image: string;
    featured: boolean;
    isActive: boolean;
  };
};

const initialState: ProductActionState = {};

export function EditProductForm({
  product,
}: EditProductFormProps) {
  const updateProductWithId =
    updateProduct.bind(null, product.id);

  const [state, formAction] = useActionState(
    updateProductWithId,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Product Name
          </Label>

          <Input
            id="name"
            name="name"
            defaultValue={product.name}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">
            Slug
          </Label>

          <Input
            id="slug"
            name="slug"
            defaultValue={product.slug}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">
            Brand
          </Label>

          <Input
            id="brand"
            name="brand"
            defaultValue={product.brand}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category
          </Label>

          <select
            id="category"
            name="category"
            defaultValue={product.category}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          >
            <option value="smartphones">
              Smartphones
            </option>

            <option value="laptops">
              Laptops
            </option>

            <option value="accessories">
              Accessories
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">
            Price
          </Label>

          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product.price}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPrice">
            Discount Price
          </Label>

          <Input
            id="discountPrice"
            name="discountPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={
              product.discountPrice ?? ""
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">
            Stock
          </Label>

          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            defaultValue={product.stock}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">
            Image URL
          </Label>

          <Input
            id="image"
            name="image"
            type="url"
            defaultValue={product.image}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={product.description}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product.featured}
          />

          Featured Product
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product.isActive}
          />

          Active
        </label>
      </div>

      {state.error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <ProductSubmitButton
  text="Save Changes"
  pendingText="Saving..."
/>
    </form>
  );
}