import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-3 h-5 w-72" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="grid gap-5 sm:grid-cols-5 sm:items-center">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-8" />
                <Skeleton className="h-10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}