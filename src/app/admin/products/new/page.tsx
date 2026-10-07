import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewProductPage() {
  return (
    <main>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Product
          </h1>

          <p className="mt-2 text-muted-foreground">
            Add a new product to the TechSphere catalog.
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
            Product Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </main>
  );
}