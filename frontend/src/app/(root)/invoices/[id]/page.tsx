"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Edit,
  FileText,
  Home,
  MoreVertical,
  Pencil,
  Printer,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentHistoryCard } from "~/components/invoices/PaymentHistoryCard";
import { RecordPaymentDialog } from "~/components/invoices/RecordPaymentDialog";
import MaxContainer from "~/components/shared/MaxContainer";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { useDeleteInvoice, useInvoiceById } from "~/lib/query/invoices";
import { cn, formatCurrency } from "~/lib/utils";
import { Invoice } from "~/types/invoice";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const { data: invoice, isLoading } = useInvoiceById(invoiceId);
  const deleteInvoiceMutation = useDeleteInvoice();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  if (!invoiceId) {
    return notFound();
  }

  if (isLoading) {
    return <InvoiceDetailsSkeleton />;
  }

  if (!invoice) {
    return notFound();
  }

  const getStatusConfig = (status: Invoice["status"]) => {
    const configs = {
      draft: {
        label: "Draft",
        icon: Pencil,
        className: "bg-slate-100 text-slate-700 border-slate-200",
      },
      pending: {
        label: "Pending",
        icon: Clock,
        className: "bg-amber-50 text-amber-700 border-amber-200",
      },
      paid: {
        label: "Paid",
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      partial: {
        label: "Partial Payment",
        icon: AlertCircle,
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      overdue: {
        label: "Overdue",
        icon: AlertCircle,
        className: "bg-red-50 text-red-700 border-red-200",
      },
      void: {
        label: "Void",
        icon: XCircle,
        className: "bg-slate-100 text-slate-500 border-slate-200",
      },
    };
    return configs[status] || configs.draft;
  };

  const statusConfig = getStatusConfig(invoice.status);
  const StatusIcon = statusConfig.icon;
  const balance = Number(invoice.amount) - Number(invoice.amountPaid);
  const isPaid = invoice.status === "paid";

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this invoice? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteInvoiceMutation.mutateAsync(invoiceId);
      toast.success("Invoice deleted successfully");
      router.push("/invoices");
    } catch (error) {
      toast.error("Failed to delete invoice");
    }
  };

  const LINEAR_CARD_STYLES = {
    card: "rounded-sm border-slate-200 shadow-sm overflow-hidden",
    header: "border-b border-slate-100 bg-slate-50/30 px-6 py-4",
    title: "text-xs font-bold uppercase tracking-widest text-slate-900",
    content: "p-6",
  };

  return (
    <MaxContainer className="!px-0">
      <div className="flex flex-col space-y-8">
        {/* Header (Aligned with LeaseDetailsPage) */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500 mb-4">
            <Link
              href="/dashboard"
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <Home className="h-3 w-3" />
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link
              href="/invoices"
              className="hover:text-slate-900 transition-colors"
            >
              Invoices
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 font-semibold">
              Invoice Details
            </span>
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="flex items-start gap-4">
              <Link href="/invoices">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-sm border-slate-200 hover:bg-slate-50 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                      statusConfig.className
                    )}
                  >
                    <StatusIcon className="h-3 w-3 mr-1.5" />
                    {statusConfig.label}
                  </Badge>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Due {format(new Date(invoice.dueDate), "MMM dd")}
                  </span>
                </div>

                <h1 className="text-3xl font-light tracking-tight text-slate-900">
                  INV-{invoice.id.slice(0, 8).toUpperCase()}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span>{invoice.tenant?.fullName || "Unknown Tenant"}</span>
                  </div>
                  {invoice.unit && (
                    <>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span>{invoice.unit.propertyName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 flex items-center justify-center border border-slate-300 rounded-[2px] text-[8px] font-bold text-slate-500">
                          U
                        </div>
                        <span>Unit {invoice.unit.code}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>
                      Created{" "}
                      {format(new Date(invoice.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isPaid && invoice.status !== "void" && (
                <Button
                  onClick={() => setPaymentDialogOpen(true)}
                  className="h-10 bg-slate-900 text-white hover:bg-slate-800 rounded-sm gap-2 shadow-sm uppercase tracking-wider text-xs font-semibold px-4"
                >
                  <CreditCard className="h-4 w-4" />
                  Record Payment
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-sm border-slate-200 bg-white hover:bg-slate-50"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/invoices/${invoice.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Invoice
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content - 8/4 Split Layout */}
        <div className="px-4 sm:px-7 pb-12">
          {/* Overdue/Pending Alert */}
          {invoice.status === "overdue" && (
            <div className="bg-red-50 border border-red-200 rounded-sm p-4 flex items-center gap-3 mb-8">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="font-bold text-red-800 text-sm uppercase tracking-wider">
                  Payment Overdue
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  This invoice was due on{" "}
                  {format(new Date(invoice.dueDate), "MMM dd, yyyy")}.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT COLUMN (Wider - Details) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Clean Section: Invoice Information */}
              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" />
                  Invoice Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <DetailItem
                    label="Description"
                    value={invoice.description}
                    valueClassName="text-slate-700 leading-relaxed font-normal"
                    className="sm:col-span-2"
                  />
                  <DetailItem
                    label="Invoice Type"
                    value={invoice.type.replace(/_/g, " ")}
                    className="capitalize"
                  />
                  <DetailItem
                    label="Billing Period"
                    value={`${format(new Date(invoice.createdAt), "MMM dd")} - ${format(new Date(invoice.dueDate), "MMM dd, yyyy")}`}
                  />
                </div>
              </div>

              {/* Clean Section: Related Entities (Matches Lease Details) */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  Related Entities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Tenant Info */}
                  {invoice.tenant && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Bill To
                        </span>
                      </div>
                      <div className="pl-6 border-l-2 border-slate-100 space-y-3">
                        <div>
                          <p className="font-bold text-slate-900">
                            {invoice.tenant.fullName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {invoice.tenant.email}
                          </p>
                          <p className="text-xs text-slate-500">
                            {invoice.tenant.phone}
                          </p>
                        </div>
                        <Link href={`/tenants/${invoice.tenant.id}`}>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900"
                          >
                            View Profile{" "}
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Property Info */}
                  {invoice.unit && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Property
                        </span>
                      </div>
                      <div className="pl-6 border-l-2 border-slate-100 space-y-3">
                        <div>
                          <p className="font-bold text-slate-900">
                            {invoice.unit.propertyName || "N/A"}
                          </p>
                          <p className="text-xs text-slate-500">
                            Unit {invoice.unit.code}
                          </p>
                        </div>
                        {invoice.lease && (
                          <Link href={`/leases/${invoice.leaseId}`}>
                            <Button
                              variant="link"
                              className="h-auto p-0 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900"
                            >
                              View Lease{" "}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Payment History */}
              <PaymentHistoryCard
                transactions={invoice.transactions || []}
                totalAmount={Number(invoice.amount)}
                amountPaid={Number(invoice.amountPaid)}
              />
            </div>

            {/* RIGHT COLUMN (Sidebar - Financials & Context) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Premium Payment Summary Card (Dark Theme) */}
              <div className="bg-[#1A1A1A] text-white p-6 rounded-sm shadow-sm space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    Payment Summary
                  </p>
                  <div className="flex justify-between items-end">
                    <h3 className="text-3xl font-light tracking-tight text-white">
                      {formatCurrency(Number(invoice.amount))}
                    </h3>
                    {isPaid && (
                      <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 text-[10px] border-0 rounded-sm px-1.5 h-5 mb-1.5">
                        PAID
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Paid to date</span>
                    <span className="text-white font-medium">
                      {formatCurrency(Number(invoice.amountPaid))}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                    <span className="text-xs uppercase tracking-wide self-center text-white/60 font-normal">
                      Balance Due
                    </span>
                    <span
                      className={
                        balance > 0 ? "text-white" : "text-emerald-400"
                      }
                    >
                      {formatCurrency(balance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <RecordPaymentDialog
        invoice={invoice}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
      />
    </MaxContainer>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  className,
  valueClassName,
}: {
  icon?: any;
  label: string;
  value: any;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
          {label}
        </span>
      </div>
      <p
        className={`text-sm font-medium text-slate-900 ${valueClassName || ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function InvoiceDetailsSkeleton() {
  return (
    <MaxContainer className="!px-0">
      <div className="space-y-8">
        <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-6">
          <div className="max-w-[1600px] mx-auto">
            <Skeleton className="h-4 w-64 mb-4" />
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-sm" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-10 w-40 rounded-sm" />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-7">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MaxContainer>
  );
}
