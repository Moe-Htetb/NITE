import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

export const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border border-gray-300 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-3/4 bg-gray-300" />
              <Skeleton className="h-4 w-1/3 bg-gray-300" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 bg-gray-300" />
              <Skeleton className="h-6 w-20 bg-gray-300" />
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-gray-300" />

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full bg-gray-300 rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="aspect-square bg-gray-300 rounded"
                  />
                ))}
              </div>
            </div>

            {/* Details Skeleton */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 bg-gray-300" />
                <Skeleton className="h-24 w-full bg-gray-300" />
              </div>

              <Separator className="bg-gray-300" />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-gray-300" />
                  <Skeleton className="h-8 w-24 bg-gray-300" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-300" />
                  <Skeleton className="h-8 w-28 bg-gray-300" />
                </div>
              </div>

              <Separator className="bg-gray-300" />

              {/* Colors Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-32 bg-gray-300" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-6 w-16 bg-gray-300 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Sizes Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-28 bg-gray-300" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-6 w-12 bg-gray-300 rounded"
                    />
                  ))}
                </div>
              </div>

              {/* Info Skeleton */}
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-gray-300" />
                    <Skeleton className="h-4 w-32 bg-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
