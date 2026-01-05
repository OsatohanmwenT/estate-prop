"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  CreditCard,
  History as HistoryIcon,
  Mail,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn, formatCurrency } from "~/lib/utils";
import { invoiceService } from "~/services/invoiceService";

interface UnitHistoryProps {
  unitId: string;
  tenantId?: string | null;
}

export function UnitHistory({ unitId, tenantId }: UnitHistoryProps) {
  // Fetch invoices/transactions for this unit's tenant
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["unit-invoices", tenantId],
    queryFn: () =>
      tenantId
        ? invoiceService.getAllInvoices({ tenantId, limit: 100, page: 1 })
        : Promise.resolve([]),
    enabled: !!tenantId,
  });

  if (!tenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 rounded-sm bg-slate-50/50">
        <HistoryIcon className="h-8 w-8 text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-900">No tenant assigned</p>
        <p className="text-xs text-slate-500 mt-1">
          History will appear once a tenant is assigned to this unit.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  const activities = [];

  // Add invoice activities
  if (invoices && invoices.length > 0) {
    for (const invoice of invoices) {
      // Invoice created
      activities.push({
        id: `invoice-${invoice.id}`,
        type: "invoice" as const,
        date: new Date(invoice.createdAt),
        description: `Invoice created: ${invoice.description}`,
        amount: Number(invoice.amount),
        status: invoice.status,
      });

      // Payment transactions
      if (invoice.transactions && invoice.transactions.length > 0) {
        for (const transaction of invoice.transactions) {
          activities.push({
            id: `payment-${transaction.id}`,
            type: "payment" as const,
            date: new Date(transaction.paidAt),
            description: `Payment received via ${transaction.method.replace(/_/g, " ")}`,
            amount: Number(transaction.amount),
            reference: transaction.reference,
          });
        }
      }

      // Email notifications (simulated - would come from actual email log)
      if (invoice.status === "pending" || invoice.status === "overdue") {
        activities.push({
          id: `email-${invoice.id}`,
          type: "email" as const,
          date: new Date(invoice.createdAt),
          description: `Invoice email sent to tenant`,
          subject: `Rent Invoice - ${invoice.description}`,
        });
      }
    }
  }

  // Sort by date descending
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 rounded-sm bg-slate-50/50">
        <HistoryIcon className="h-8 w-8 text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-900">No history yet</p>
        <p className="text-xs text-slate-500 mt-1">
          Payment and communication history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0 border border-slate-200 rounded-sm bg-white">
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className={cn(
            "flex items-start gap-4 p-4 hover:bg-slate-50/50 transition-colors",
            index !== activities.length - 1 && "border-b border-slate-100"
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
              activity.type === "payment" && "bg-emerald-50",
              activity.type === "invoice" && "bg-blue-50",
              activity.type === "email" && "bg-purple-50"
            )}
          >
            {activity.type === "payment" && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            )}
            {activity.type === "invoice" && (
              <CreditCard className="h-4 w-4 text-blue-600" />
            )}
            {activity.type === "email" && (
              <Mail className="h-4 w-4 text-purple-600" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900">
              {activity.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {activity.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {activity.type === "payment" && activity.reference && (
                <>
                  <span className="text-slate-300">•</span>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {activity.reference}
                  </p>
                </>
              )}
              {activity.type === "email" && activity.subject && (
                <>
                  <span className="text-slate-300">•</span>
                  <p className="text-[10px] text-slate-400 truncate">
                    {activity.subject}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Amount/Status */}
          <div className="text-right shrink-0">
            {activity.type === "payment" && (
              <p className="text-sm font-mono font-bold text-emerald-600">
                +{formatCurrency(activity.amount)}
              </p>
            )}
            {activity.type === "invoice" && activity.status && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm",
                  activity.status === "paid" &&
                    "border-emerald-200 text-emerald-700 bg-emerald-50",
                  activity.status === "pending" &&
                    "border-amber-200 text-amber-700 bg-amber-50",
                  activity.status === "overdue" &&
                    "border-red-200 text-red-700 bg-red-50",
                  activity.status === "partial" &&
                    "border-blue-200 text-blue-700 bg-blue-50"
                )}
              >
                {activity.status}
              </Badge>
            )}
            {activity.type === "email" && (
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border-purple-200 text-purple-700 bg-purple-50"
              >
                Sent
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
