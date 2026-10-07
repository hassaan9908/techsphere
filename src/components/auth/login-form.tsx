"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  loginUser,
  type LoginState,
} from "@/app/login/actions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginSubmitButton } from "@/components/auth/login-submit-button";

type LoginFormProps = {
  redirectTo?: string;
};

const initialState: LoginState = {};

export function LoginForm({
  redirectTo = "/",
}: LoginFormProps) {
  const [state, formAction] = useActionState(
    loginUser,
    initialState
  );

  const registerHref =
    redirectTo && redirectTo !== "/"
      ? `/register?redirectTo=${encodeURIComponent(
          redirectTo
        )}`
      : "/register";

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
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <LoginSubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={registerHref}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}