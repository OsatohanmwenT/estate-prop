"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Receipt } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/lib/utils";
import { invoiceService } from "~/services/invoiceService";

interface TenantPaymentsTabProps {
  tenantId: string;
}

export function TenantPaymentsTab({ tenantId }: TenantPaymentsTabProps) {
  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["tenant-invoices", tenantId],
    queryFn: () =>
      invoiceService.getAllInvoices({ tenantId, limit: 50, page: 1 }),
  });

  console.log("TenantPaymentsTab - Invoices:", invoices);
  console.log("TenantPaymentsTab - Loading:", isLoading);
  console.log("TenantPaymentsTab - Error:", error);

  if (isLoading) {
    return (
      <div className="divide-y divide-slate-100">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
            <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Flatten all transactions from all invoices
  const allPayments: Array<{
    id: string;
    invoiceId: string;
    invoiceDescription: string;
    amount: number;
    method: string;
    paidAt: Date;
    reference?: string;
    invoiceAmount: number;
    invoiceStatus: string;
  }> = [];

  if (invoices && invoices.length > 0) {
    for (const invoice of invoices) {
      if (invoice.transactions && invoice.transactions.length > 0) {
        for (const transaction of invoice.transactions) {
          allPayments.push({
            id: transaction.id,
            invoiceId: invoice.id,
            invoiceDescription: invoice.description,
            amount: Number(transaction.amount),
            method: transaction.method,
            paidAt: new Date(transaction.paidAt),
            reference: transaction.reference || undefined,
            invoiceAmount: Number(invoice.amount),
            invoiceStatus: invoice.status,
          });
        }
      }
    }
  }

  // Sort by date descending
  allPayments.sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime());

  if (allPayments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50 border-t border-slate-100">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <Receipt className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-900">No payments recorded</p>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Payment history will appear here once the tenant makes their first payment.
        </p>
      </div>
    );
  }

  // Calculate total paid
  const totalPaid = allPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div>
      {/* Summary Header */}
      <div className="bg-slate-50 border-b border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">
              Total Paid
            </p>
            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(totalPaid)}
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-slate-200 bg-white text-slate-600 text-[10px] uppercase font-bold tracking-wider px-2 py-1"
          >
            {allPayments.length} {allPayments.length === 1 ? "Payment" : "Payments"}
          </Badge>
        </div>
      </div>

      {/* Payments List */}
      <div className="divide-y divide-slate-100">
        {allPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(payment.amount)}
                </span>
                {payment.invoiceStatus === "paid" && (
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 rounded-sm border-emerald-200 text-emerald-700 bg-emerald-50"
                  >
                    Paid
                  </Badge>
                )}
                {payment.invoiceStatus === "partial" && (
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 rounded-sm border-blue-200 text-blue-700 bg-blue-50"
                  >
                    Partial
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {payment.invoiceDescription}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                <span>
                  {payment.paidAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{payment.method.replace(/_/g, " ")}</span>
                {payment.reference && (
                  <>
                    <span>•</span>
                    <span className="font-mono">{payment.reference}</span>
                  </>
                )}
              </div>
            </div>
            <Link href={`/invoices/${payment.invoiceId}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
        <Link
          href={`/invoices?tenantId=${tenantId}`}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wider transition-colors"
        >
          View All Invoices
        </Link>
      </div>
    </div>
  );
}
