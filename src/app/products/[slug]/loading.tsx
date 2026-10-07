import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductDetailsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />

        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-9 w-36" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-11 w-40" />
        </div>
      </div>

      <Card className="mt-10">
        <CardContent className="space-y-4 p-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </main>
  );
}