"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, Eye, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Unit } from "~/types/property";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DuplicateUnitSheet } from "./DuplicateUnitSheet";

export const unitColumns: ColumnDef<Unit>[] = [
  {
    accessorKey: "property",
    header: "Property",
    cell: ({ row }) => {
      const property = row.original.property;
      if (!property) return <div className="text-muted-foreground">N/A</div>;

      return (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                {property.name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{property.name}</span>
            <span className="text-xs text-muted-foreground">
              {property.address}, {property.city}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Unit",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("code")}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className="capitalize">{type?.replace("_", " ") || "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        vacant: { label: "Vacant", className: "bg-yellow-100 text-yellow-800" },
        occupied: {
          label: "Occupied",
          className: "bg-green-100 text-green-800",
        },
      };

      const config = statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      };

      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "tenant",
    header: "Tenant Name",
    cell: ({ row }) => {
      const tenant = row.original.tenant;
      const status = row.original.status;

      if (status === "vacant" || !tenant) {
        return <div className="text-muted-foreground">-</div>;
      }

      const fullName = tenant.fullName;
      const initials = fullName
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span>{fullName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "rentAmount",
    header: "Market Rent",
    cell: ({ row }) => {
      const rent = parseFloat(row.getValue("rentAmount"));
      return <div className="font-medium">${rent.toLocaleString()}</div>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const unit = row.original;
      const router = useRouter();
      const [showDuplicateSheet, setShowDuplicateSheet] = useState(false);

      const propertyId = unit.property?.id || unit.propertyId || "";

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/properties/${propertyId}/units/${unit.id}`)
                }
                disabled={!propertyId}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/properties/${propertyId}/units/${unit.id}/edit`)
                }
                disabled={!propertyId}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Unit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDuplicateSheet(true)}
                disabled={!propertyId}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Unit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {propertyId && (
            <DuplicateUnitSheet
              unit={unit}
              propertyId={propertyId}
              open={showDuplicateSheet}
              onOpenChange={setShowDuplicateSheet}
            />
          )}
        </>
      );
    },
  },
];
