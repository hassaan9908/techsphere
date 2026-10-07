"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createOrder } from "@/app/checkout/actions";

import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CheckoutFormProps = {
  user: {
    name: string;
    email: string;
  };
};

export function CheckoutForm({
  user,
}: CheckoutFormProps) {
  const router = useRouter();

  const {
    items,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(
      event.currentTarget
    );

    const result = await createOrder({
      name: String(
        formData.get("name") ?? ""
      ),

      email: String(
        formData.get("email") ?? ""
      ),

      phone: String(
        formData.get("phone") ?? ""
      ),

      address: String(
        formData.get("address") ?? ""
      ),

      city: String(
        formData.get("city") ?? ""
      ),

      postalCode: String(
        formData.get("postalCode") ?? ""
      ),

      country: String(
        formData.get("country") ?? ""
      ),

      paymentMethod: "cod",

      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    clearCart();

    router.push(
      `/orders/${result.orderId}`
    );

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold">
          Contact Information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name
            </Label>

            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold">
          Shipping Address
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">
              Address
            </Label>

            <Input
              id="address"
              name="address"
              placeholder="House / Street / Area"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">
              City
            </Label>

            <Input
              id="city"
              name="city"
              placeholder="Islamabad"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">
              Postal Code
            </Label>

            <Input
              id="postalCode"
              name="postalCode"
              placeholder="44000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">
              Country
            </Label>

            <Input
              id="country"
              name="country"
              defaultValue="Pakistan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number
            </Label>

            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+92 300 1234567"
              required
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold">
          Payment
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Cash on Delivery is currently available.
        </p>

        <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-lg border p-4">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            defaultChecked
          />

          <div>
            <p className="font-medium">
              Cash on Delivery
            </p>

            <p className="text-sm text-muted-foreground">
              Pay when your order arrives.
            </p>
          </div>
        </label>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {error}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Product availability or pricing may have changed.
            Please review your cart before trying again.
          </p>
        </div>
      )}

      <div className="rounded-xl border p-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Items
          </span>

          <span>
            {totalItems}
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-muted-foreground">
            Subtotal
          </span>

          <span>
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-muted-foreground">
            Shipping
          </span>

          <span>
            Free
          </span>
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between">
            <span className="text-lg font-semibold">
              Total
            </span>

            <span className="text-xl font-bold">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={
            isSubmitting ||
            items.length === 0
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing Order...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </form>
  );
}