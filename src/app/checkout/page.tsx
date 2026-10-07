import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getSession } from "@/lib/auth/session";

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session) {
    redirect(
      "/login?redirectTo=/checkout"
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Checkout
        </h1>

        <p className="mt-2 text-muted-foreground">
          Complete your shipping details and place your
          order.
        </p>
      </div>

      <CheckoutForm
        user={{
          name: session.name,
          email: session.email,
        }}
      />
    </main>
  );
}