import type { Metadata } from "next";

import {
  Mail,
  Phone,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about TechSphere, a modern marketplace for smartphones, laptops, and technology accessories.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium text-muted-foreground">
          About TechSphere
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Technology made easier to discover.
        </h1>

        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          TechSphere is a modern e-commerce platform
          designed to provide a simple and efficient
          way to explore smartphones, laptops, and
          technology accessories from leading brands.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Our Platform
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="leading-7 text-muted-foreground">
              TechSphere provides product discovery,
              search and filtering, persistent shopping
              carts, secure user accounts, checkout,
              order tracking, and inventory management
              through a modern full-stack shopping
              experience.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Our Goal
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="leading-7 text-muted-foreground">
              Our goal is to deliver a fast, secure,
              responsive, and easy-to-use shopping
              experience across desktop and mobile
              devices.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            Contact Us
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <a
            href="mailto:hassaanatif5@gmail.com"
            className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            hassaanatif5@gmail.com
          </a>

          <a
            href="tel:+923105259908"
            className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            +92 310 5259908
          </a>
        </CardContent>
      </Card>
    </main>
  );
}