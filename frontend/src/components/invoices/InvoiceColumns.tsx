"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useDeleteInvoice } from "~/lib/query/invoices";
import { formatCurrency } from "~/lib/utils";
import { Invoice } from "~/types/invoice";

const getStatusConfig = (status: Invoice["status"]) => {
  const configs: Record<
    Invoice["status"],
    {
      label: string;
      variant: "secondary" | "destructive";
      icon: React.ComponentType<{ className?: string }>;
      className: string;
    }
  > = {
    draft: {
      label: "Draft",
      variant: "secondary" as const,
      icon: Pencil,
      className: "bg-slate-100 text-slate-700",
    },
    pending: {
      label: "Pending",
      variant: "secondary" as const,
      icon: Clock,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    paid: {
      label: "Paid",
      variant: "secondary" as const,
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    partial: {
      label: "Partial",
      variant: "secondary" as const,
      icon: AlertCircle,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    overdue: {
      label: "Overdue",
      variant: "destructive" as const,
      icon: AlertCircle,
      className: "bg-red-50 text-red-700 border-red-200",
    },
    void: {
      label: "Void",
      variant: "secondary" as const,
      icon: XCircle,
      className: "bg-slate-100 text-slate-500 border-slate-200",
    },
  };
  return configs[status];
};

export const createInvoiceColumns = (
  onRecordPayment: (invoice: Invoice) => void
): ColumnDef<Invoice>[] => [
  {
    accessorKey: "id",
    header: "Invoice",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <Link
          href={`/invoices/${invoice.id}`}
          className="font-mono text-sm hover:text-slate-900 hover:underline"
        >
          INV-{invoice.id.slice(0, 8).toUpperCase()}
        </Link>
      );
    },
    enableSorting: true,
  },
  {
    id: "tenant",
    header: "Tenant",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900">
            {invoice.tenant ? `${invoice.tenant.fullName}` : "N/A"}
          </span>
          <span className="text-xs text-slate-500">
            {invoice.tenant?.email || ""}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "property",
    header: "Property",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm text-slate-900">
            {invoice.unit?.propertyName || "N/A"}
          </span>
          <span className="text-xs text-slate-500">
            Unit {invoice.unit?.code || ""}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const invoice = row.original;
      const balance = Number(invoice.amount) - Number(invoice.amountPaid);
      return (
        <div className="flex flex-col font-mono">
          <span className="text-sm font-semibold text-slate-900">
            {formatCurrency(Number(invoice.amount))}
          </span>
          {invoice.status === "partial" && (
            <span className="text-xs text-amber-600">
              Bal: {formatCurrency(balance)}
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const invoice = row.original;
      const daysOverdue =
        invoice.status === "overdue"
          ? Math.floor(
              (new Date().getTime() - new Date(invoice.dueDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;

      return (
        <div className="flex flex-col">
          <span className="text-sm text-slate-900">
            {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
          </span>
          {invoice.status === "overdue" && (
            <span className="text-xs text-red-600">
              {daysOverdue} days overdue
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const invoice = row.original;
      const statusConfig = getStatusConfig(invoice.status);
      const StatusIcon = statusConfig.icon;

      return (
        <Badge
          variant={statusConfig.variant}
          className={`${statusConfig.className} rounded-sm text-xs gap-1.5 font-medium px-2.5 py-1`}
        >
          <StatusIcon className="h-3 w-3" />
          {statusConfig.label}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const invoice = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const deleteInvoiceMutation = useDeleteInvoice();

      const handleDelete = async () => {
        if (
          !confirm(
            "Are you sure you want to delete this invoice? This action cannot be undone."
          )
        ) {
          return;
        }

        try {
          await deleteInvoiceMutation.mutateAsync(invoice.id);
          toast.success("Invoice deleted successfully");
        } catch (error) {
          toast.error("Failed to delete invoice");
        }
      };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-slate-900"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/invoices/${invoice.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              {invoice.status !== "paid" && invoice.status !== "void" && (
                <DropdownMenuItem onClick={() => onRecordPayment(invoice)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Record Payment
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/invoices/${invoice.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-700"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
  },
];
