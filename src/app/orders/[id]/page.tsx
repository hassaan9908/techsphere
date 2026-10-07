import Image from "next/image";
import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";
import mongoose from "mongoose";

import { getSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import Order from "@/models/Order";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type OrderDetailsPageProps = {
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

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const session = await getSession();

  if (!session) {
    redirect(
      "/login?redirectTo=/orders"
    );
  }

  const { id } = await params;

  if (
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    notFound();
  }

  await connectToDatabase();

  const order = await Order.findOne({
    _id: id,
    userId: session.userId,
  }).lean();

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="secondary">
          Order Placed
        </Badge>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Thank you for your order
        </h1>

        <p className="mt-2 text-muted-foreground">
          Your order has been successfully created.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Order ID: {order._id.toString()}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Order Items
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {order.items.map(
                (item: OrderItem) => (
                  <div
                    key={item.productId.toString()}
                    className="flex gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
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

                    <div className="flex flex-1 justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-medium hover:underline"
                        >
                          {item.name}
                        </Link>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          $
                          {item.price.toFixed(
                            2
                          )}{" "}
                          each
                        </p>
                      </div>

                      <p className="font-semibold">
                        $
                        {item.subtotal.toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Shipping Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">
                {
                  order.shippingAddress
                    .name
                }
              </p>

              <p>
                {
                  order.shippingAddress
                    .email
                }
              </p>

              <p>
                {
                  order.shippingAddress
                    .phone
                }
              </p>

              <p className="pt-2 text-muted-foreground">
                {
                  order.shippingAddress
                    .address
                }
              </p>

              <p className="text-muted-foreground">
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

              <p className="text-muted-foreground">
                {
                  order.shippingAddress
                    .country
                }
              </p>
            </CardContent>
          </Card>
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
                Status
              </span>

              <Badge
                variant="outline"
                className="capitalize"
              >
                {order.status}
              </Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Payment
              </span>

              <span className="uppercase">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Payment Status
              </span>

              <span className="capitalize">
                {order.paymentStatus}
              </span>
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

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
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
            </div>

            <Link
              href="/orders"
              className={buttonVariants({
                className: "w-full",
              })}
            >
              View My Orders
            </Link>

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