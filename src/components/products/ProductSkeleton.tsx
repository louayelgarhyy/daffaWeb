import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-border">
      <Skeleton className="h-[17rem] w-full bg-muted" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 bg-muted" />
        <Skeleton className="h-4 w-1/2 bg-muted" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20 bg-muted" />
          <Skeleton className="h-10 w-10 rounded-full bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
};

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};
