"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";

type AddToCartButtonProps = {
  product: {
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    stock: number;
  };
};

export function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart({
      ...product,
      quantity: 1,
    });

    toast.success("Added to cart", {
      description: `${product.name} was added to your cart.`,
    });
  }

  return (
    <Button
      size="lg"
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className="w-full sm:w-auto"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />

      {product.stock > 0
        ? "Add to Cart"
        : "Out of Stock"}
    </Button>
  );
}