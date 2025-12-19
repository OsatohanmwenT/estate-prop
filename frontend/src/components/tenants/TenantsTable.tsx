"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Info, Trash2 } from "lucide-react";
import Link from "next/link";
import { DataTable } from "~/components/shared/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/lib/utils";
import { TenantWithDetails } from "~/types/tenant";

export const tenantColumns: ColumnDef<TenantWithDetails>[] = [
  {
    accessorKey: "id",
    header: "No",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.index + 1}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "avatarUrl",
    header: "Image",
    cell: ({ row }) => (
      <Avatar className="h-9 w-9">
        <AvatarImage src={row.original.avatarUrl} alt={row.original.fullName} />
        <AvatarFallback>{row.original.fullName.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("fullName")}</span>
    ),
  },
  {
    accessorKey: "propertyName",
    header: "Property Name",
    cell: ({ row }) => row.original.propertyName || "-",
  },
  {
    accessorKey: "propertyAddress",
    header: "Property Address",
    cell: ({ row }) => (
      <span className="text-muted-foreground truncate max-w-[200px] block">
        {row.original.propertyAddress || "-"}
      </span>
    ),
  },
  {
    accessorKey: "unitType",
    header: "Contact Details", // Matching the design label, though it shows unit type
    cell: ({ row }) => row.original.unitType || "-",
  },
  {
    accessorKey: "rentAmount",
    header: "Rent",
    cell: ({ row }) => {
      const amount = row.original.rentAmount;
      return amount ? <span>{formatCurrency(Number(amount))}/month</span> : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "destructive" | "outline" | "secondary" =
        "default";
      let className = "";

      switch (status) {
        case "active": // "Rent Paid" in design
          variant = "secondary";
          className = "bg-green-100 text-green-700 hover:bg-green-100";
          break;
        case "overdue":
          variant = "secondary";
          className = "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
          break;
        case "terminated": // "Late fees" in design? Or "Overdue"
          variant = "destructive";
          className = "bg-red-100 text-red-700 hover:bg-red-100";
          break;
        default:
          variant = "outline";
      }

      // Mapping design labels
      const label =
        status === "active"
          ? "Rent Paid"
          : status === "overdue"
            ? "Overdue"
            : status === "terminated"
              ? "Terminated"
              : status;

      return (
        <Badge variant={variant} className={className}>
          {label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/tenants/${row.original.id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
          >
            <Info className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/tenants/${row.original.id}/edit`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

interface TenantsTableProps {
  data: TenantWithDetails[];
  searchQuery?: string;
}

export function TenantsTable({ data, searchQuery }: TenantsTableProps) {
  return (
    <DataTable
      columns={tenantColumns}
      data={data}
      searchKey="fullName"
      searchValue={searchQuery}
      pagination
      containerClassName="bg-card w-full rounded-lg border border-border"
    />
  );
}
