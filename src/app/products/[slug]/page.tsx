import Image from "next/image";
import { notFound } from "next/navigation";

import { connectToDatabase } from "@/lib/db/mongodb";
import Product from "@/models/Product";
import type { Metadata } from "next";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProductDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};
export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  await connectToDatabase();

  const product = await Product.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}
export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;

  await connectToDatabase();

  const product = await Product.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="secondary">
                {product.category}
              </Badge>

              {product.featured && (
                <Badge>
                  Featured
                </Badge>
              )}

              {product.stock > 0 ? (
                <Badge variant="outline">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Out of Stock
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              {product.name}
            </h1>

            <p className="mt-2 text-muted-foreground">
              {product.brand}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold">
                  ${product.discountPrice}
                </span>

                <span className="text-lg text-muted-foreground line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">
                ${product.price}
              </span>
            )}
          </div>

          <p className="text-base leading-7 text-muted-foreground">
            {product.description}
          </p>

          <div>
            <p className="text-sm font-medium">
              Available Stock
            </p>

            <p className="text-lg">
              {product.stock} units
            </p>
          </div>

          <AddToCartButton
            product={{
              productId:
                product._id.toString(),
              name: product.name,
              slug: product.slug,
              image:
                product.images?.[0] ?? "",
              price:
                product.discountPrice ??
                product.price,
              stock: product.stock,
            }}
          />
        </div>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>
            Specifications
          </CardTitle>
        </CardHeader>

        <CardContent>
          {product.specifications &&
          product.specifications.length > 0 ? (
            <div className="divide-y">
              {product.specifications.map(
                (
                  specification: {
                    key: string;
                    value: string;
                  },
                  index: number
                ) => (
                  <div
                    key={`${specification.key}-${index}`}
                    className="grid gap-2 py-4 sm:grid-cols-2"
                  >
                    <span className="font-medium">
                      {specification.key}
                    </span>

                    <span className="text-muted-foreground">
                      {specification.value}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No specifications available.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}