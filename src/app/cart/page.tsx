"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />

          <h1 className="mt-5 text-2xl font-bold">
            Your cart is empty
          </h1>

          <p className="mt-2 text-muted-foreground">
            Add some products to start shopping.
          </p>

          <Link
            href="/products"
            className={buttonVariants({
              className: "mt-6",
            })}
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shopping Cart
          </h1>

          <p className="mt-2 text-muted-foreground">
            {totalItems} item
            {totalItems === 1 ? "" : "s"} in your cart
          </p>
        </div>

        <Button
  variant="outline"
  onClick={() => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (confirmed) {
      clearCart();
    }
  }}
>
  Clear Cart
</Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="flex flex-col gap-5 p-6 sm:flex-row">
                <div className="relative h-28 w-full overflow-hidden rounded-lg bg-muted sm:w-32">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-1 font-medium">
                      ${item.price.toFixed(2)}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.stock} available
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center rounded-md border">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="min-w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        disabled={
                          item.quantity >=
                          item.stock
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeFromCart(
                          item.productId
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    $
                    {(
                      item.price *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>
              Order Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Items
              </span>

              <span>
                {totalItems}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>
                  Total
                </span>

                <span>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() =>
                router.push("/checkout")
              }
            >
              Proceed to Checkout
            </Button>

            <Link
              href="/products"
              className={buttonVariants({
                variant: "outline",
                className: "w-full",
              })}
            >
              Continue Shopping
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}