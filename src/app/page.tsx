import Image from "next/image";
import Link from "next/link";

import { connectToDatabase } from "@/lib/db/mongodb";
import Product from "@/models/Product";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default async function HomePage() {
  await connectToDatabase();

  const featuredProducts = await Product.find({
    featured: true,
    isActive: true,
  })
    .limit(3)
    .lean();

  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <Badge
              variant="secondary"
              className="mb-4 w-fit"
            >
              Premium Tech Marketplace
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover the latest
              <span className="block">
                technology in one place.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Shop smartphones, laptops, and accessories
              from leading technology brands with a fast
              and modern shopping experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className={buttonVariants({
                  size: "lg",
                })}
              >
                Shop Products
              </Link>

              <Link
                href="/products?category=smartphones"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                })}
              >
                Browse Smartphones
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="grid w-full max-w-md grid-cols-2 gap-4">
              <div className="rounded-2xl border bg-background p-6">
                <p className="text-sm text-muted-foreground">
                  Categories
                </p>

                <p className="mt-2 text-3xl font-bold">
                  3
                </p>
              </div>

              <div className="rounded-2xl border bg-background p-6">
                <p className="text-sm text-muted-foreground">
                  Featured Tech
                </p>

                <p className="mt-2 text-3xl font-bold">
                  Latest
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border bg-background p-6">
                <p className="text-sm text-muted-foreground">
                  Explore
                </p>

                <p className="mt-2 text-xl font-semibold">
                  Smartphones • Laptops • Accessories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Products
            </h2>

            <p className="mt-2 text-muted-foreground">
              Hand-picked products from our catalog.
            </p>
          </div>

          <Link
            href="/products"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            View All
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Card
                key={product._id.toString()}
                className="overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">
                      {product.category}
                    </Badge>

                    <Badge>
                      Featured
                    </Badge>
                  </div>

                  <CardTitle className="mt-3">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {product.brand}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    {product.discountPrice ? (
                      <>
                        <span className="text-xl font-bold">
                          ${product.discountPrice}
                        </span>

                        <span className="text-sm text-muted-foreground line-through">
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Link
                    href={`/products/${product.slug}`}
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    View Product
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            No featured products available.
          </div>
        )}
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-semibold">
                Smartphones
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Discover flagship and premium smartphones.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Laptops
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Explore powerful laptops for work and productivity.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Accessories
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Complete your setup with premium accessories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}