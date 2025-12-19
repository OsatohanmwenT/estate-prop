import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface PropertiesTableSkeletonProps {
  rows?: number;
}

export function PropertiesTableSkeleton({
  rows = 5,
}: PropertiesTableSkeletonProps) {
  return (
    <>
      {/* Mobile/Tablet List Skeleton - Below md */}
      <div className="lg:hidden space-y-3">
        <div className="space-y-3 mb-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border bg-card p-3"
            >
              {/* Image Skeleton */}
              <Skeleton className="h-16 w-16 flex-shrink-0 rounded-md" />

              {/* Content Skeleton */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3 w-40" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Status Badge Skeleton */}
              <Skeleton className="h-6 w-16 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Skeleton - md and above */}
      <div className="hidden lg:block border rounded-2xl">
        {/* Search and Filters Skeleton */}
        <div className="flex items-center py-4 px-4 gap-3">
          <Skeleton className="h-8 flex-1 max-w-sm" />
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-8 w-10" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-md border-t border-b bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px]">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead className="min-w-[300px]">Property</TableHead>
                <TableHead className="w-[150px]">Type</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[80px] text-center">Units</TableHead>
                <TableHead className="w-[140px]">Occupancy Rate</TableHead>
                <TableHead className="w-[120px]">Balance</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, index) => (
                <TableRow key={index}>
                  {/* Checkbox */}
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>

                  {/* Property with Image and Details */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-[180px]" />
                        <Skeleton className="h-3 w-[240px]" />
                      </div>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Skeleton className="h-6 w-[100px] rounded-full" />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                  </TableCell>

                  {/* Units */}
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-6 mx-auto" />
                  </TableCell>

                  {/* Occupancy Rate */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </TableCell>

                  {/* Balance */}
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Skeleton className="h-9 w-[60px] ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
