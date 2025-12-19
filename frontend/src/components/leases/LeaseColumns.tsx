"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Edit,
    Eye,
    MoreHorizontal,
    RefreshCw,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "~/lib/utils";
import { calculateDaysRemaining, getLeaseStatusBadge } from "~/schemas/lease";
import { LeaseWithDetails } from "~/types/lease";

export const createLeaseColumns = (
  onTerminate?: (leaseId: string) => void,
  onRenew?: (leaseId: string) => void
): ColumnDef<LeaseWithDetails>[] => [
  {
    accessorKey: "tenant",
    header: "Tenant",
    cell: ({ row }) => {
      const tenant = row.original.tenant;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-slate-100">
              {tenant?.fullName?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {tenant?.fullName || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {tenant?.email || "-"}
            </p>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "property",
    header: "Property / Unit",
    cell: ({ row }) => {
      const property = row.original.property;
      const unit = row.original.unit;
      return (
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">
            {property?.name || "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground">
            {unit?.code || "-"} • {unit?.type || "-"}
          </p>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Period
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const startDate = formatDate(row.original.startDate);
      const endDate = formatDate(row.original.endDate);
      const daysRemaining = calculateDaysRemaining(row.original.endDate);

      return (
        <div className="min-w-0">
          <p className="text-sm font-mono text-slate-700">
            {startDate} - {endDate}
          </p>
          {row.original.status === "active" && (
            <p
              className={`text-xs ${daysRemaining <= 30 ? "text-amber-600 font-bold" : "text-muted-foreground"}`}
            >
              {daysRemaining > 0
                ? `${daysRemaining} days remaining`
                : "Expired"}
            </p>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "rentAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Rent
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.original.rentAmount);
      const cycle = row.original.billingCycle;
      return (
        <div>
          <p className="font-medium text-sm font-mono text-slate-900">
            {formatCurrency(amount)}
          </p>
          <p className="text-xs text-muted-foreground capitalize">{cycle}</p>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { label, className } = getLeaseStatusBadge(row.original.status);
      return (
        <Badge variant="secondary" className={className}>
          {label}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const lease = row.original;
      const isActive = lease.status === "active";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/leases/${lease.id}`}>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </Link>
            {isActive && (
              <>
                <Link href={`/leases/${lease.id}/edit`}>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Lease
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onRenew?.(String(lease.id))}
                  className="text-blue-600"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Renew Lease
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onTerminate?.(String(lease.id))}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Terminate Lease
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
