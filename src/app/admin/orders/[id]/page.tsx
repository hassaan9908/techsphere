import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

import { connectToDatabase } from "@/lib/db/mongodb";
import Order from "@/models/Order";

import { OrderStatusForm } from "@/components/admin/order-status-form";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { OrderStatus } from "@/lib/validations/order";

type AdminOrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type OrderItem = {
  productId: {
    toString(): string;
  };

  name: string;
  slug: string;
  image?: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  const { id } = await params;

  if (
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    notFound();
  }

  await connectToDatabase();

  const order = await Order.findById(
    id
  ).lean();

  if (!order) {
    notFound();
  }

  const createdAt = new Date(
    order.createdAt
  );

  return (
    <main className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order Details
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Order #
            {order._id
              .toString()
              .slice(-8)
              .toUpperCase()}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Placed on{" "}
            {createdAt.toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        </div>

        <Link
          href="/admin/orders"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Back to Orders
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Ordered Products
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {order.items.map(
                (item: OrderItem) => (
                  <div
                    key={item.productId.toString()}
                    className="flex gap-4 border-b pb-5 last:border-0 last:pb-0"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-semibold hover:underline"
                      >
                        {item.name}
                      </Link>

                      <p className="text-sm text-muted-foreground">
                        Quantity:{" "}
                        {item.quantity}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Unit Price: $
                        {item.price.toFixed(
                          2
                        )}
                      </p>
                    </div>

                    <p className="font-semibold">
                      $
                      {item.subtotal.toFixed(
                        2
                      )}
                    </p>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Customer Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">
                  Full Name
                </p>

                <p className="font-medium">
                  {
                    order
                      .shippingAddress
                      .name
                  }
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Email
                </p>

                <p className="font-medium">
                  {
                    order
                      .shippingAddress
                      .email
                  }
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Phone
                </p>

                <p className="font-medium">
                  {
                    order
                      .shippingAddress
                      .phone
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Shipping Address
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-1 text-sm">
              <p>
                {
                  order.shippingAddress
                    .address
                }
              </p>

              <p>
                {
                  order.shippingAddress
                    .city
                }
                ,{" "}
                {
                  order.shippingAddress
                    .postalCode
                }
              </p>

              <p>
                {
                  order.shippingAddress
                    .country
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Order Management
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Current Status
                </p>

                <Badge
                  variant="outline"
                  className="capitalize"
                >
                  {order.status}
                </Badge>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">
                  Update Order Status
                </p>

                <OrderStatusForm
  key={`${order._id.toString()}-${order.status}`}
  orderId={order._id.toString()}
  currentStatus={
    order.status as OrderStatus
  }
/>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Payment Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Payment Method
                </span>

                <span className="uppercase">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Payment Status
                </span>

                <Badge
                  variant="outline"
                  className="capitalize"
                >
                  {order.paymentStatus}
                </Badge>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span>
                  $
                  {order.subtotal.toFixed(
                    2
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Shipping
                </span>

                <span>
                  Free
                </span>
              </div>

              <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>
                  Total
                </span>

                <span>
                  $
                  {order.total.toFixed(
                    2
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}