import Image from "next/image";
import Link from "next/link";

import { connectToDatabase } from "@/lib/db/mongodb";
import Product from "@/models/Product";

import { ArchiveProductButton } from "@/components/admin/archive-product-button";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminProductsPage() {
  await connectToDatabase();

  const products = await Product.find({})
    .sort({
      createdAt: -1,
    })
    .lean();

  return (
    <main>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Products
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage TechSphere products and inventory.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className={buttonVariants()}
        >
          Add Product
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="space-y-4">
          {products.map((product) => (
            <Card
              key={product._id.toString()}
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.images?.[0] ? (
                        <Image
                          src={
                            product.images[0]
                          }
                          alt={
                            product.name
                          }
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

                    <div>
                      <h2 className="font-semibold">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {product.brand}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {
                            product.category
                          }
                        </Badge>

                        {product.featured && (
                          <Badge>
                            Featured
                          </Badge>
                        )}

                        {!product.isActive && (
                          <Badge variant="outline">
                            Inactive
                          </Badge>
                        )}

                        {product.stock <= 0 && (
                          <Badge variant="destructive">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Price
                    </p>

                    <p className="font-semibold">
                      $
                      {(
                        product.discountPrice ??
                        product.price
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Stock
                    </p>

                    <p className="font-semibold">
                      {product.stock}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.isActive && (
                      <Link
                        href={`/products/${product.slug}`}
                        className={buttonVariants({
                          variant:
                            "outline",
                        })}
                      >
                        View
                      </Link>
                    )}

                    <Link
                      href={`/admin/products/${product._id.toString()}/edit`}
                      className={buttonVariants()}
                    >
                      Edit
                    </Link>

                    {product.isActive && (
                      <ArchiveProductButton
                        productId={product._id.toString()}
                        productName={
                          product.name
                        }
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              No Products
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              Add your first product to TechSphere.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}