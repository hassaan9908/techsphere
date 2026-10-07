"use client";

import { useActionState } from "react";

import {
  createProduct,
  type ProductActionState,
} from "@/app/admin/products/actions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSubmitButton } from "@/components/admin/product-submit-button";
const initialState: ProductActionState = {};

export function ProductForm() {
  const [state, formAction] = useActionState(
    createProduct,
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
            placeholder="iPhone 16 Pro"
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
            placeholder="iphone-16-pro"
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
            placeholder="Apple"
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
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">
              Select category
            </option>

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
            placeholder="999"
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
            placeholder="949"
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
            placeholder="20"
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
            placeholder="https://..."
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
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Product description..."
          required
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
          />

          Featured Product
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked
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
  text="Create Product"
  pendingText="Creating..."
/>
    </form>
  );
}