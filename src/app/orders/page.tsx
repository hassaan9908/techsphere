import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";

import Order from "@/models/Order";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
type OrderItem = {
  quantity: number;
};
export default async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect(
      "/login?redirectTo=/orders"
    );
  }

  await connectToDatabase();

  const orders = await Order.find({
    userId: session.userId,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          My Orders
        </h1>

        <p className="mt-2 text-muted-foreground">
          View your previous TechSphere orders.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const createdAt = new Date(
              order.createdAt
            );

            return (
              <Card key={order._id.toString()}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order
                      </p>

                      <p className="mt-1 font-medium">
                        #{order._id
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
                        Items
                      </p>

                      <p className="mt-1 font-medium">
                       {order.items.reduce(
  (total: number, item: OrderItem) => total + item.quantity,
  0
)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total
                      </p>

                      <p className="mt-1 font-semibold">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Status
                      </p>

                      <Badge variant="outline">
                        {order.status}
                      </Badge>
                    </div>

                    <Link
                      href={`/orders/${order._id.toString()}`}
                      className={buttonVariants({
                        variant: "outline",
                      })}
                    >
                      View Order
                    </Link>
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
            Once you place an order, it will appear here.
          </p>

          <Link
            href="/products"
            className={buttonVariants({
              className: "mt-6",
            })}
          >
            Start Shopping
          </Link>
        </div>
      )}
    </main>
  );
}