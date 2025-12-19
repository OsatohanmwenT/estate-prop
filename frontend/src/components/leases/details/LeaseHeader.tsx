"use client";

import {
    Building2,
    Calendar,
    ChevronRight,
    Edit,
    MoreVertical,
    RefreshCw,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, formatDate } from "~/lib/utils";
import { LeaseWithDetails } from "~/types/lease";

interface LeaseHeaderProps {
  lease: LeaseWithDetails;
  isActive: boolean;
  onTerminate: () => void;
  onRenew: () => void;
}

export function LeaseHeader({
  lease,
  isActive,
  onTerminate,
  onRenew,
}: LeaseHeaderProps) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
        <Link href="/leases" className="hover:text-slate-900 transition-colors">
          Leases
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/properties/${lease.property?.id}`}
          className="hover:text-slate-900 transition-colors"
        >
          {lease.property?.name || "Property"}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900">Lease Details</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn(
                "rounded-sm text-[10px] uppercase px-2 py-0.5 font-bold tracking-wider border-0",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {isActive ? "Active Lease" : lease.status}
            </Badge>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">
              {`#${lease.id.slice(0, 8)}`}
            </span>
          </div>

          <h1 className="text-4xl font-light text-slate-900 tracking-tight">
            {lease.tenant?.fullName || "Unknown Tenant"}
          </h1>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{lease.property?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 flex items-center justify-center border border-slate-300 rounded-[2px] text-[8px] font-bold">
                U
              </div>
              <span>Unit {lease.unit?.code}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {isActive ? (
            <>
              <Button
                variant="outline"
                className="h-10 rounded-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-900 uppercase text-xs font-bold tracking-wider transition-colors"
                onClick={onRenew}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Renew
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-10 p-0 rounded-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/leases/${lease.id}/edit`}>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Lease
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onTerminate}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Terminate Lease
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              disabled
              variant="outline"
              className="opacity-50 cursor-not-allowed"
            >
              Lease Inactive
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
