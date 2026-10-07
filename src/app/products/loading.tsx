import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default function ProductsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-3 h-5 w-72" />
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-4">
        <Skeleton className="h-10 md:col-span-2" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />

            <CardHeader>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-3 h-6 w-3/4" />
            </CardHeader>

            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}