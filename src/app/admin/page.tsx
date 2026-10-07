import { connectToDatabase } from "@/lib/db/mongodb";

import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    pendingOrders,
    revenueResult,
  ] = await Promise.all([
    Product.countDocuments(),

    Order.countDocuments(),

    User.countDocuments({
      role: "customer",
    }),

    Order.countDocuments({
      status: "pending",
    }),

    Order.aggregate([
      {
        $match: {
  paymentStatus: "paid",
},
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total",
          },
        },
      },
    ]),
  ]);

  const totalRevenue =
    revenueResult[0]?.totalRevenue ?? 0;

  const stats = [
    {
      label: "Products",
      value: totalProducts,
    },
    {
      label: "Orders",
      value: totalOrders,
    },
    {
      label: "Customers",
      value: totalCustomers,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
    },
  ];

  return (
    <main>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage TechSphere products, inventory,
          customers, and orders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            Total Revenue
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            ${Number(totalRevenue).toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Revenue from all non-cancelled orders.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}