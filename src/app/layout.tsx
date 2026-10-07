import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/providers/cart-provider";
import { Toaster } from "@/components/ui/sonner";

import { getSession } from "@/lib/auth/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TechSphere",
    template: "%s | TechSphere",
  },
  description:
    "Shop smartphones, laptops, and accessories from leading technology brands on TechSphere.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar session={session} />

            <div className="flex-1">
              {children}
            </div>

            <Footer />
          </div>

          <Toaster
            richColors
            position="top-right"
          />
        </CartProvider>
      </body>
    </html>
  );
}