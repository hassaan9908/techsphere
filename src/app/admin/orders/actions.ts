
"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { connectToDatabase } from "@/lib/db/mongodb";
import {
  orderStatusSchema,
  type OrderStatus,
} from "@/lib/validations/order";

import Order from "@/models/Order";
import Product from "@/models/Product";

type UpdateOrderStatusResult =
  | { success: true }
  | { success: false; error: string };

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<UpdateOrderStatusResult> {
  await requireAdmin();

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return {
      success: false,
      error: "Invalid order ID.",
    };
  }

  const parsed = orderStatusSchema.safeParse(newStatus);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid order status.",
    };
  }

  await connectToDatabase();

  const dbSession = await mongoose.startSession();

  try {
    await dbSession.withTransaction(async () => {
      const order = await Order.findById(orderId)
        .session(dbSession);

      if (!order) {
        throw new Error("Order not found.");
      }

      const currentStatus = order.status as OrderStatus;

      if (
        !allowedTransitions[currentStatus]?.includes(newStatus)
      ) {
        throw new Error(
          `Cannot change order from ${currentStatus} to ${newStatus}.`
        );
      }

      // Conditional update prevents two requests from
      // successfully changing the same original status.
      const result = await Order.updateOne(
        {
          _id: orderId,
          status: currentStatus,
        },
        {
          $set: {
            status: newStatus,
            paymentStatus:
              newStatus === "delivered"
                ? "paid"
                : order.paymentStatus,
          },
        },
        { session: dbSession }
      );

      if (result.modifiedCount !== 1) {
        throw new Error(
          "Order was updated by another request. Please refresh."
        );
      }

      // Restore inventory on cancellation.
      if (newStatus === "cancelled") {
        for (const item of order.items) {
          const stockResult = await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: item.quantity } },
            { session: dbSession }
          );

          if (stockResult.matchedCount !== 1) {
            throw new Error(
              "A product from this order no longer exists. Stock could not be restored."
            );
          }
        }
      }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/products");
    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Order status update error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update order status.",
    };
  } finally {
    await dbSession.endSession();
  }
}
