import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const DashboardLoading = () => {
  return (
    <div className="px-4 py-4 bg-neutral-50 sm:py-6 sm:px-8 w-full">
      {/* Stats Cards Skeleton */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="bg-white rounded-sm border-neutral-200 shadow-none"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Cards Skeleton */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-white mt-5 h-96 rounded-sm gap-1 border-neutral-200 shadow-none w-full">
          <CardHeader className="flex items-center justify-between">
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-white mt-5 h-96 rounded-sm gap-1 border-neutral-200 shadow-none w-full">
          <CardHeader className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pending Rent Payment Table Skeleton */}
      <div className="flex">
        <Card className="bg-white mt-5 min-h-96 rounded-sm gap-1 border-neutral-200 shadow-none w-full">
          <CardHeader className="flex items-center justify-between">
            <Skeleton className="h-6 w-56" />
          </CardHeader>
          <CardContent className="pt-4">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 pb-4 border-b">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            {/* Table Rows */}
            <div className="space-y-4 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-8 gap-4 items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardLoading;
