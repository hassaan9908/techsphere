import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";

type RegisterPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
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
            Create your account
          </CardTitle>

          <CardDescription>
            Join TechSphere to checkout and manage your
            orders.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm redirectTo={redirectTo} />
        </CardContent>
      </Card>
    </main>
  );
}