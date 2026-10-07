import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

import { connectToDatabase } from "@/lib/db/mongodb";
import Product from "@/models/Product";

import { EditProductForm } from "@/components/admin/edit-product-form";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectToDatabase();

  const product = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  return (
    <main>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Product
          </h1>

          <p className="mt-2 text-muted-foreground">
            Update product details and inventory.
          </p>
        </div>

        <Link
          href="/admin/products"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Back
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <EditProductForm
            product={{
              id: product._id.toString(),
              name: product.name,
              slug: product.slug,
              description: product.description,
              brand: product.brand,
              category: product.category,
              price: product.price,
              discountPrice:
                product.discountPrice ?? null,
              stock: product.stock,
              image:
                product.images?.[0] ?? "",
              featured: product.featured,
              isActive: product.isActive,
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}