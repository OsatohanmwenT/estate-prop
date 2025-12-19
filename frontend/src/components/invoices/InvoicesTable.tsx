"use client";

import {
  CreditCard,
  FileText,
  Plus,
  Search,
  SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { DataTable } from "~/components/shared/DataTable";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { useInvoices } from "~/lib/query/invoices";
import { formatCurrency } from "~/lib/utils";
import { Invoice } from "~/types/invoice";
import { createInvoiceColumns } from "./InvoiceColumns";
import { RecordPaymentDialog } from "./RecordPaymentDialog";

export function InvoicesTable() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Note: search support depends on backend/hook implementation.
  // Assuming useInvoices supports basic list fetching and we might filter client side or hook supports search param.
  // Based on previous file view, useInvoices takes { status, search }.
  const { data: invoicesData, isLoading } = useInvoices({
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
    
  });

  const invoices = invoicesData || [];

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
  }, [searchInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setSearchQuery(searchInput);
      }
    },
    [searchInput]
  );

  const handleRecordPayment = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => createInvoiceColumns(handleRecordPayment),
    [handleRecordPayment]
  );

  // Custom search component for desktop
  const customSearchComponent = useMemo(
    () => (
      <div className="flex gap-2">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search invoices..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-8 text-sm bg-white border-slate-200 rounded-sm focus:border-slate-900"
          />
        </div>
        <Button
          onClick={handleSearch}
          size="sm"
          className="h-8 rounded-sm bg-slate-900 text-white hover:bg-slate-800"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    ),
    [searchInput, handleKeyDown, handleSearch]
  );

  // Custom actions for desktop
  const customActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-sm border-slate-200 text-xs font-medium uppercase tracking-wider"
        >
          <SlidersHorizontal className="h-3 w-3 mr-2" /> Filter
        </Button>
        <Link href="/invoices/add">
          <Button
            size="sm"
            className="h-8 rounded-sm bg-slate-900 text-white hover:bg-slate-800 gap-2"
          >
            <Plus className="h-3 w-3" />
            Create Invoice
          </Button>
        </Link>
      </div>
    ),
    []
  );

  const loadingSkeletons = (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-sm" />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <>
        <div className="lg:hidden">{loadingSkeletons}</div>
        <div className="hidden lg:block space-y-4">
          <Skeleton className="h-12 w-full rounded-sm" />
          <Skeleton className="h-64 w-full rounded-sm" />
        </div>
      </>
    );
  }

  // Mobile/Card View Content
  const mobileView = (
    <div className="lg:hidden space-y-4">
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Invoices ({invoices.length})
          </h2>
          <Link href="/invoices/add">
            <Button
              size="sm"
              className="h-8 rounded-sm bg-slate-900 text-white hover:bg-slate-800"
            >
              <Plus className="h-3 w-3 mr-1" /> Create
            </Button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search invoices..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 bg-white border-slate-200 rounded-sm focus:border-slate-900"
            />
          </div>
          <Button
            onClick={handleSearch}
            size="default"
            className="rounded-sm bg-slate-900 text-white hover:bg-slate-800"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 bg-white border-slate-200 rounded-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-slate-200">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
          <CreditCard className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-slate-500 font-medium">No invoices found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Card
              key={invoice.id}
              className="rounded-lg border border-slate-200 shadow-sm overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        INV-{invoice.id.substring(0, 8)}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {invoice.tenant?.fullName || "Unknown Tenant"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      invoice.status === "paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : invoice.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {invoice.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-500 mb-4">
                  <div>
                    <span className="block font-medium text-slate-700">
                      Due Date
                    </span>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </div>
                  <div className="text-right">
                    <span className="block font-medium text-slate-700">
                      Amount
                    </span>
                    {formatCurrency(Number(invoice.amount))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/invoices/${invoice.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-8 text-xs border-slate-200"
                    >
                      View Details
                    </Button>
                  </Link>
                  {invoice.status !== "paid" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleRecordPayment(invoice)}
                    >
                      Record Pay
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileView}

      {/* Desktop View */}
      <div className="hidden lg:block">
        <DataTable
          columns={columns}
          data={invoices}
          title="Invoices"
          showCount
          searchable={false}
          filterable
          filterOptions={[
            {
              label: "Status",
              value: statusFilter,
              options: [
                { label: "All Status", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Paid", value: "paid" },
                { label: "Overdue", value: "overdue" },
                { label: "Draft", value: "draft" },
              ],
              onChange: setStatusFilter,
            },
          ]}
          customSearch={customSearchComponent}
          customActions={customActions}
          pagination
          pageSize={10}
          sortable
          containerClassName="rounded-lg border border-slate-200 bg-white shadow-sm"
        />
      </div>

      {selectedInvoice && (
        <RecordPaymentDialog
          invoice={selectedInvoice}
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
        />
      )}
    </>
  );
}
