import { Skeleton } from "@/components/ui/skeleton"; // Use your UI library's skeleton component

const DashboardSkeleton = () => {
  return (
    <div className="bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="h-px w-full" />

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>

        {/* Table Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
