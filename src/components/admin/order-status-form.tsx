"use client";

import {
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateOrderStatus } from "@/app/admin/orders/actions";
import { Button } from "@/components/ui/button";

import type { OrderStatus } from "@/lib/validations/order";

type OrderStatusFormProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

const transitions: Record<
  OrderStatus,
  OrderStatus[]
> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function OrderStatusForm({
  orderId,
  currentStatus,
}: OrderStatusFormProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<OrderStatus>(currentStatus);

  const [error, setError] = useState<
    string | null
  >(null);

  const [pending, startTransition] =
    useTransition();

  const nextStatuses =
    transitions[currentStatus];

  const isFinal =
    nextStatuses.length === 0;

  function handleUpdate() {
    if (status === currentStatus) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result =
        await updateOrderStatus(
          orderId,
          status
        );

      if (!result.success) {
        toast.error(
          "Status update failed",
          {
            description: result.error,
          }
        );

        setError(result.error);

        // Reset dropdown if update failed.
        setStatus(currentStatus);

        router.refresh();

        return;
      }

      toast.success("Order updated", {
        description: `Order status changed to ${status}.`,
      });

      router.refresh();
    });
  }

  if (isFinal) {
    return (
      <p className="text-sm font-medium capitalize text-muted-foreground">
        {currentStatus} (Final)
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={status}
          disabled={pending}
          onChange={(event) =>
            setStatus(
              event.target.value as OrderStatus
            )
          }
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value={currentStatus}>
            {currentStatus}
          </option>

          {nextStatuses.map(
            (nextStatus) => (
              <option
                key={nextStatus}
                value={nextStatus}
              >
                {nextStatus}
              </option>
            )
          )}
        </select>

        <Button
          type="button"
          onClick={handleUpdate}
          disabled={
            pending ||
            status === currentStatus
          }
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}