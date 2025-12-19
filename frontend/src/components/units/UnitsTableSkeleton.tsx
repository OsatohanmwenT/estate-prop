import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface UnitsTableSkeletonProps {
  rows?: number;
}

export function UnitsTableSkeleton({ rows = 5 }: UnitsTableSkeletonProps) {
  return (
    <>
      {/* Mobile/Tablet List Skeleton - Below lg */}
      <div className="lg:hidden space-y-3">
        <div className="space-y-3 mb-4">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border bg-card p-3"
            >
              {/* Icon Skeleton */}
              <Skeleton className="h-16 w-16 flex-shrink-0 rounded-md" />

              {/* Content Skeleton */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3 w-32" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Status Badge Skeleton */}
              <Skeleton className="h-6 w-16 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Skeleton - lg and above */}
      <div className="hidden lg:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Property</TableHead>
              <TableHead className="w-[100px]">Unit</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[200px]">Tenant Name</TableHead>
              <TableHead className="w-[100px]">Market Rent</TableHead>
              <TableHead className="w-[100px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                {/* Property: Image + Name + Address */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                </TableCell>

                {/* Unit */}
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>

                {/* Type */}
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Skeleton className="h-6 w-[80px] rounded-full" />
                </TableCell>

                {/* Tenant Name: Avatar + Name */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </TableCell>

                {/* Market Rent */}
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
