import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminLoading() {
  return (
    <main>
      <div className="mb-8">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="mt-3 h-5 w-80" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-9 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}