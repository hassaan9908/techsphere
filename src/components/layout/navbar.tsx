"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart } from "lucide-react";

import { logoutUser } from "@/app/actions/auth";
import { useCart } from "@/components/providers/cart-provider";
import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SessionPayload } from "@/lib/auth/session";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "About Us",
    href: "/about",
  },
];

type NavbarProps = {
  session: SessionPayload | null;
};

export function Navbar({
  session,
}: NavbarProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
        >
          TechSphere
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "text-sm font-medium text-foreground"
                    : "text-sm text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "relative",
            })}
          >
            <ShoppingCart className="h-4 w-4" />

            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
                {totalItems}
              </span>
            )}

            <span className="sr-only">
              Shopping Cart
            </span>
          </Link>

          {session ? (
            <div className="hidden items-center gap-2 md:flex">
                <Link
  href="/orders"
  className={buttonVariants({
    variant: "ghost",
  })}
>
  My Orders
</Link>
{session.role === "admin" && (
  <Link
    href="/admin"
    className={buttonVariants({
      variant: "ghost",
    })}
  >
    Admin
  </Link>
)}
              <span className="max-w-40 truncate text-sm text-muted-foreground">
                {session.name}
              </span>

              <form action={logoutUser}>
                <Button
                  type="submit"
                  variant="outline"
                >
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Sign In
            </Link>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                  />
                }
              >
                <Menu className="h-4 w-4" />
              </SheetTrigger>

              <SheetContent side="right">
  <div className="mt-8 flex flex-col gap-2">
    {navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted"
      >
        {item.label}
      </Link>
    ))}

    <Link
      href="/cart"
      className="rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted"
    >
      Cart ({totalItems})
    </Link>

    {session && (
      <Link
        href="/orders"
        className="rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted"
      >
        My Orders
      </Link>
    )}

    <div className="my-3 border-t" />

    {session ? (
      <div className="space-y-3">
        <p className="px-3 text-sm text-muted-foreground">
          Signed in as {session.name}
        </p>

        <form action={logoutUser}>
          <Button
            type="submit"
            variant="outline"
            className="w-full"
          >
            Logout
          </Button>
        </form>
      </div>
    ) : (
      <Link
        href="/login"
        className="rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted"
      >
        Sign In
      </Link>
    )}
  </div>
</SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}