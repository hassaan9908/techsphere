import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";

import { LoginForm } from "@/components/auth/login-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const session = await getSession();
  const params = await searchParams;

  const redirectTo =
    params.redirectTo &&
    params.redirectTo.startsWith("/") &&
    !params.redirectTo.startsWith("//")
      ? params.redirectTo
      : "/";

  if (session) {
    redirect(redirectTo);
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Welcome back
          </CardTitle>

          <CardDescription>
            Sign in to checkout and manage your orders.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm redirectTo={redirectTo} />
        </CardContent>
      </Card>
    </main>
  );
}