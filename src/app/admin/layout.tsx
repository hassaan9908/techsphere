import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { buttonVariants } from "@/components/ui/button";
export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | TechSphere Admin",
  },
  description:
    "TechSphere administration dashboard.",
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[220px_1fr] sm:px-6 lg:px-8">
        <aside className="h-fit rounded-xl border bg-background p-4">
          <h2 className="mb-4 text-lg font-semibold">
            Admin Panel
          </h2>

          <nav className="flex flex-col gap-2">
            <Link
              href="/admin"
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start",
              })}
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products"
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start",
              })}
            >
              Products
            </Link>

            <Link
              href="/admin/orders"
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start",
              })}
            >
              Orders
            </Link>
          </nav>
        </aside>

        <section>{children}</section>
      </div>
    </div>
  );
}