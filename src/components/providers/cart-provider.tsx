"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { CartItem } from "@/types/cart";

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (
    productId: string
  ) => void;
  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedCart =
        localStorage.getItem(
          "techsphere-cart"
        );

      if (storedCart) {
        try {
          const parsedCart =
            JSON.parse(storedCart);

          if (Array.isArray(parsedCart)) {
            setItems(parsedCart);
          }
        } catch {
          localStorage.removeItem(
            "techsphere-cart"
          );
        }
      }

      setLoaded(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      "techsphere-cart",
      JSON.stringify(items)
    );
  }, [items, loaded]);

  function addToCart(
    item: CartItem
  ) {
    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (cartItem) =>
            cartItem.productId ===
            item.productId
        );

      if (existingItem) {
        return currentItems.map(
          (cartItem) =>
            cartItem.productId ===
            item.productId
              ? {
                  ...cartItem,
                  quantity: Math.min(
                    cartItem.quantity +
                      item.quantity,
                    cartItem.stock
                  ),
                }
              : cartItem
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: Math.min(
            item.quantity,
            item.stock
          ),
        },
      ];
    });
  }

  function removeFromCart(
    productId: string
  ) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.productId !== productId
      )
    );
  }

  function updateQuantity(
    productId: string,
    quantity: number
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(
                  quantity,
                  item.stock
                )
              ),
            }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems =
    items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const totalPrice =
    items.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}