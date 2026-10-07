"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { archiveProduct } from "@/app/admin/products/actions";
import { Button } from "@/components/ui/button";

type ArchiveProductButtonProps = {
  productId: string;
  productName: string;
};

export function ArchiveProductButton({
  productId,
  productName,
}: ArchiveProductButtonProps) {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleArchive() {
    const confirmed = window.confirm(
      `Archive "${productName}"? It will no longer appear in the public store.`
    );

    if (!confirmed) {
      return;
    }

    setPending(true);
    setError(null);

    const result = await archiveProduct(productId);

    if (!result.success) {
      toast.error("Archive failed", {
        description: result.error,
      });

      setError(result.error);
      setPending(false);
      return;
    }

    toast.success("Product archived", {
      description: `${productName} has been removed from the public store.`,
    });

    setPending(false);
    router.refresh();
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        variant="destructive"
        disabled={pending}
        onClick={handleArchive}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Archiving...
          </>
        ) : (
          <>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}