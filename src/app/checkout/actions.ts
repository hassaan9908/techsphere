"use server";

import mongoose from "mongoose";

import { getSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import {
  checkoutSchema,
  type CheckoutInput,
} from "@/lib/validations/order";

import Order from "@/models/Order";
import Product from "@/models/Product";

type CreateOrderResult =
  | {
      success: true;
      orderId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function createOrder(
  input: CheckoutInput
): Promise<CreateOrderResult> {
  const user = await getSession();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in to place an order.",
    };
  }

  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error:
        parsed.error.issues[0]?.message ??
        "Invalid checkout information.",
    };
  }

  await connectToDatabase();

  const uniqueItems = new Map<
    string,
    number
  >();

  for (const item of parsed.data.items) {
    if (
      !mongoose.Types.ObjectId.isValid(
        item.productId
      )
    ) {
      return {
        success: false,
        error: "Invalid product in cart.",
      };
    }

    uniqueItems.set(
      item.productId,
      (uniqueItems.get(item.productId) ?? 0) +
        item.quantity
    );
  }

  const itemEntries = Array.from(
    uniqueItems.entries()
  ).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));

  const mongoSession =
    await mongoose.startSession();

  let createdOrderId = "";

  try {
    await mongoSession.withTransaction(
      async () => {
        const productIds = itemEntries.map(
          (item) => item.productId
        );

        const products = await Product.find({
          _id: {
            $in: productIds,
          },
          isActive: true,
        }).session(mongoSession);

        if (
          products.length !==
          itemEntries.length
        ) {
          throw new Error(
            "One or more products are unavailable."
          );
        }

        const orderItems = [];
        let subtotal = 0;

        for (const cartItem of itemEntries) {
          const product = products.find(
            (product) =>
              product._id.toString() ===
              cartItem.productId
          );

          if (!product) {
            throw new Error(
              "Product not found."
            );
          }

          if (
            product.stock <
            cartItem.quantity
          ) {
            throw new Error(
              `${product.name} does not have enough stock.`
            );
          }

          const price =
            product.discountPrice ??
            product.price;

          const itemSubtotal =
            price * cartItem.quantity;

          subtotal += itemSubtotal;

          orderItems.push({
            productId: product._id,
            name: product.name,
            slug: product.slug,
            image:
              product.images?.[0] ?? "",
            price,
            quantity:
              cartItem.quantity,
            subtotal: itemSubtotal,
          });
        }

        /*
          For now:
          Shipping = $0
          Tax = $0

          Therefore total = subtotal.
          We can extend this later.
        */
        const total = subtotal;

        for (const item of itemEntries) {
          const stockUpdate =
            await Product.updateOne(
              {
                _id: item.productId,
                stock: {
                  $gte: item.quantity,
                },
              },
              {
                $inc: {
                  stock: -item.quantity,
                },
              },
              {
                session: mongoSession,
              }
            );

          if (
            stockUpdate.modifiedCount !== 1
          ) {
            throw new Error(
              "Product stock changed. Please review your cart."
            );
          }
        }

        const orders = await Order.create(
          [
            {
              userId: user.userId,

              items: orderItems,

              shippingAddress: {
                name: parsed.data.name,
                email: parsed.data.email,
                phone: parsed.data.phone,
                address:
                  parsed.data.address,
                city: parsed.data.city,
                postalCode:
                  parsed.data.postalCode,
                country:
                  parsed.data.country,
              },

              paymentMethod:
                parsed.data.paymentMethod,

              paymentStatus: "pending",
              status: "pending",

              subtotal,
              total,
            },
          ],
          {
            session: mongoSession,
          }
        );

        createdOrderId =
          orders[0]._id.toString();
      }
    );

    return {
      success: true,
      orderId: createdOrderId,
    };
  } catch (error) {
    console.error(
      "Order creation error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to place order.",
    };
  } finally {
    await mongoSession.endSession();
  }
}