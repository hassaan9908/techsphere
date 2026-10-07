"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type ProductSubmitButtonProps = {
  text: string;
  pendingText: string;
};

export function ProductSubmitButton({
  text,
  pendingText,
}: ProductSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
    >
      {pending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}

      {pending ? pendingText : text}
    </Button>
  );
}