import Link from "next/link";
import { SearchX } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-16">
      <div className="text-center">
        <SearchX className="mx-auto h-14 w-14 text-muted-foreground" />

        <p className="mt-6 text-sm font-medium text-muted-foreground">
          404
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Page not found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          The page or product you are looking for does not exist or may no longer be available.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className={buttonVariants()}
          >
            Go Home
          </Link>

          <Link
            href="/products"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
}