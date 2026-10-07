"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  registerUser,
  type RegisterState,
} from "@/app/register/actions";

import { RegisterSubmitButton } from "@/components/auth/register-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RegisterFormProps = {
  redirectTo?: string;
};

const initialState: RegisterState = {};

export function RegisterForm({
  redirectTo = "/",
}: RegisterFormProps) {
  const [state, formAction] = useActionState(
    registerUser,
    initialState
  );

  const loginHref =
    redirectTo !== "/"
      ? `/login?redirectTo=${encodeURIComponent(
          redirectTo
        )}`
      : "/login";

  return (
    <form
      action={formAction}
      className="space-y-5"
    >
      <input
        type="hidden"
        name="redirectTo"
        value={redirectTo}
      />

      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name
        </Label>

        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Muhammad Hassaan"
          autoComplete="name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>

        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {state.error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <RegisterSubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}