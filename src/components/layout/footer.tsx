import Link from "next/link";
import {
  Mail,
  Phone,
} from "lucide-react";

export function Footer() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight"
            >
              TechSphere
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              A modern technology marketplace for
              smartphones, laptops, and accessories.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Quick Links
            </h3>

            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>

              <Link
                href="/products"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Products
              </Link>

              <Link
                href="/about"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                About Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              Contact
            </h3>

            <div className="mt-3 space-y-3 text-sm">
              <a
                href="mailto:hassaanatif5@gmail.com"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                hassaanatif5@gmail.com
              </a>

              <a
                href="tel:+923105259908"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                +92 310 5259908
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {currentYear} Muhammad Hassaan. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}