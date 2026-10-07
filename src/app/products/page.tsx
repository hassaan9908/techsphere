import Image from "next/image";
import Link from "next/link";

import { connectToDatabase } from "@/lib/db/mongodb";
import Product from "@/models/Product";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
};
export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse smartphones, laptops, and accessories available on TechSphere.",
};
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const category = params.category ?? "";
  const sort = params.sort ?? "newest";

  await connectToDatabase();

  const query: Record<string, unknown> = {
    isActive: true,
  };

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (
    category &&
    ["smartphones", "laptops", "accessories"].includes(
      category
    )
  ) {
    query.category = category;
  }

  let sortOption: Record<string, 1 | -1> = {
    createdAt: -1,
  };

  if (sort === "name") {
    sortOption = {
      name: 1,
    };
  }

  let products;

  if (
    sort === "price-low" ||
    sort === "price-high"
  ) {
    const direction =
      sort === "price-low" ? 1 : -1;

    products = await Product.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          effectivePrice: {
            $ifNull: [
              "$discountPrice",
              "$price",
            ],
          },
        },
      },
      {
        $sort: {
          effectivePrice: direction,
        },
      },
    ]);
  } else {
    products = await Product.find(query)
      .sort(sortOption)
      .lean();
  }

  const hasFilters =
    Boolean(search) ||
    Boolean(category) ||
    sort !== "newest";

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Products
        </h1>

        <p className="mt-2 text-muted-foreground">
          Explore smartphones, laptops, and accessories.
        </p>
      </div>

      <form className="mb-8 grid gap-3 rounded-lg border bg-background p-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium"
          >
            Search
          </label>

          <input
            id="search"
            name="search"
            type="text"
            defaultValue={search}
            placeholder="Search products or brands..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            defaultValue={category}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">
              All categories
            </option>

            <option value="smartphones">
              Smartphones
            </option>

            <option value="laptops">
              Laptops
            </option>

            <option value="accessories">
              Accessories
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort"
            className="mb-2 block text-sm font-medium"
          >
            Sort
          </label>

          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="newest">
              Newest
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="name">
              Name A-Z
            </option>
          </select>
        </div>

        <div className="flex gap-2 md:col-span-4">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Apply
          </button>

          <Link
            href="/products"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Reset
          </Link>
        </div>
      </form>

      {products.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
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
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">
                      {product.category}
                    </Badge>

                    {product.featured && (
                      <Badge>
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="mt-3 line-clamp-2">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {product.brand}
                  </p>

                  <div className="flex items-center gap-2">
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

                  {product.stock > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {product.stock} in stock
                    </p>
                  ) : (
                    <Badge variant="destructive">
                      Out of Stock
                    </Badge>
                  )}
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

          <p className="mt-6 text-sm text-muted-foreground">
            Showing {products.length} product
            {products.length === 1 ? "" : "s"}
          </p>
        </>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-lg font-semibold">
            No products found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {hasFilters
              ? "Try changing your search, category, or sorting options."
              : "No products are currently available."}
          </p>

          {hasFilters && (
            <Link
              href="/products"
              className={buttonVariants({
                variant: "outline",
                className: "mt-4",
              })}
            >
              Clear Filters
            </Link>
          )}
        </div>
      )}
    </main>
  );
}