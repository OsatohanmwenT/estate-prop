"use client";

import { AlertTriangle, ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { OverdueRentItem } from "~/types/dashboard";
import { toast } from "sonner";

interface OverdueInvoicesCardProps {
  invoices: OverdueRentItem[];
  isLoading?: boolean;
  onSendReminder?: (invoice: OverdueRentItem) => void;
}

export function OverdueInvoicesCard({
  invoices,
  isLoading,
  onSendReminder,
}: OverdueInvoicesCardProps) {
  const handleSendReminder = (invoice: OverdueRentItem) => {
    if (onSendReminder) {
      onSendReminder(invoice);
    } else {
      // Default behavior - show toast
      toast.success(`Reminder sent to ${invoice.tenantName}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-100 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-white flex flex-col border border-red-100 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Overdue Invoices
          </h3>
          {invoices.length > 0 && (
            <span className="text-xs font-medium bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
              {invoices.length}
            </span>
          )}
        </div>
        <Link
          href="/invoices?status=overdue"
          className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y h-full divide-slate-50">
        {invoices.length === 0 ? (
          <div className="px-5 py-8 h-full flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-8 w-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No overdue invoices</p>
            <p className="text-xs text-slate-400 mt-1">
              All payments are up to date
            </p>
          </div>
        ) : (
          invoices.slice(0, 5).map((invoice) => (
            <div
              key={invoice.id}
              className="px-5 py-3 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {invoice.tenantName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {invoice.unitInfo}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-red-600">
                    {formatCurrency(invoice.amount)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {invoice.daysOverdue} days overdue
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs shrink-0 border-slate-200 hover:bg-slate-100"
                  onClick={() => handleSendReminder(invoice)}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Remind
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {invoices.length > 5 && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <Link
            href="/invoices?status=overdue"
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            +{invoices.length - 5} more overdue
          </Link>
        </div>
      )}
    </div>
  );
}
