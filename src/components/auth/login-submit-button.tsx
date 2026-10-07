"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
    >
      {pending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}

      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}