import Link from "next/link";

import { connectToDatabase } from "@/lib/db/mongodb";
import Order from "@/models/Order";

import { OrderStatusForm } from "@/components/admin/order-status-form";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { OrderStatus } from "@/lib/validations/order";

type AdminOrderItem = {
  quantity: number;
};

export default async function AdminOrdersPage() {
  await connectToDatabase();

  const orders = await Order.find({})
    .sort({
      createdAt: -1,
    })
    .lean();

  return (
    <main>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Orders
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage customer orders and fulfillment
          status.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount =
              order.items.reduce(
                (
                  total: number,
                  item: AdminOrderItem
                ) =>
                  total + item.quantity,
                0
              );

            const createdAt =
              new Date(order.createdAt);

            return (
              <Card
                key={order._id.toString()}
              >
                <CardContent className="p-6">
                  <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr_0.7fr_0.8fr_1.5fr] xl:items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order
                      </p>

                      <p className="mt-1 font-semibold">
                        #
                        {order._id
                          .toString()
                          .slice(-8)
                          .toUpperCase()}
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {createdAt.toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Customer
                      </p>

                      <p className="mt-1 font-medium">
                        {
                          order
                            .shippingAddress
                            .name
                        }
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {
                          order
                            .shippingAddress
                            .email
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Items
                      </p>

                      <p className="mt-1 font-medium">
                        {itemCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total
                      </p>

                      <p className="mt-1 font-semibold">
                        $
                        {order.total.toFixed(
                          2
                        )}
                      </p>

                      <div className="mt-2">
                        <Badge variant="outline">
                          {
                            order.paymentStatus
                          }
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <OrderStatusForm
  key={`${order._id.toString()}-${order.status}`}
  orderId={order._id.toString()}
  currentStatus={
    order.status as OrderStatus
  }
/>

                      <Link
                        href={`/admin/orders/${order._id.toString()}`}
                        className={buttonVariants({
                          variant:
                            "outline",
                          className:
                            "w-full",
                        })}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h2 className="text-xl font-semibold">
            No orders yet
          </h2>

          <p className="mt-2 text-muted-foreground">
            Customer orders will appear here.
          </p>
        </div>
      )}
    </main>
  );
}