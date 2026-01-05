"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/lib/utils";
import { Property } from "~/types/property";

export const propertyColumns: ColumnDef<Property>[] = [
  {
    id: "property",
    header: "Property",
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="flex items-center gap-4 min-w-[300px] group">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-sm bg-slate-100 border border-slate-200">
            {property.thumbnailImage ? (
              <Image
                src={property.thumbnailImage}
                alt={property.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Building2
                  className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-900">
              {property.name}
            </span>
            <span className="text-xs text-slate-500 line-clamp-1">
              {property.address}, {property.city}, {property.state}
            </span>
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "category",
    header: "Type",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const categoryMap: Record<string, { label: string; className: string }> =
        {
          residential: {
            label: "Residential",
            className: "border-blue-200 text-blue-700 bg-blue-50",
          },
          commercial: {
            label: "Commercial",
            className: "border-purple-200 text-purple-700 bg-purple-50",
          },
          industrial: {
            label: "Industrial",
            className: "border-slate-200 text-slate-700 bg-slate-50",
          },
          mixed_use: {
            label: "Mixed Use",
            className: "border-orange-200 text-orange-700 bg-orange-50",
          },
        };

      const config = categoryMap[category] || {
        label: category,
        className: "border-slate-200 text-slate-700 bg-slate-50",
      };

      return (
        <Badge
          variant="outline"
          className={`capitalize rounded-sm font-normal ${config.className}`}
        >
          {config.label}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isOccupied = status === "occupied";

      return (
        <Badge
          variant="outline"
          className={`rounded-sm font-normal pl-2 pr-2.5 py-0.5 gap-1.5 ${
            isOccupied
              ? "border-emerald-200 text-emerald-700 bg-emerald-50"
              : "border-amber-200 text-amber-700 bg-amber-50"
          }`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isOccupied ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <span className="capitalize">{status}</span>
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: "units",
    header: () => <div className="text-center">Units</div>,
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="text-center">
          <Badge
            variant="outline"
            className="rounded-sm border-slate-200 text-slate-600 font-mono text-xs bg-white"
          >
            {property.unitCount || 0}
          </Badge>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "occupancyRate",
    header: "Occupancy",
    cell: ({ row }) => {
      const property = row.original;
      const occupancyRate = property.occupancyRate || 0;

      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-600">
            {occupancyRate}%
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "revenue",
    header: "Revenue",
    cell: ({ row }) => {
      const property = row.original;
      const revenue = parseFloat(property.totalRevenue || "0");
      return (
        <span className="text-sm font-mono text-slate-900">
          {formatCurrency(revenue)}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="text-right">
          <Link href={`/properties/${property.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 bg-white"
            >
              Manage
            </Button>
          </Link>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
