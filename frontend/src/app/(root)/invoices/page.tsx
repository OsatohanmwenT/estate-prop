"use client";

import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { InvoicesTable } from "~/components/invoices/InvoicesTable";
import MaxContainer from "~/components/shared/MaxContainer";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useInvoices, useInvoiceStatistics } from "~/lib/query/invoices";
import { formatCurrency } from "~/lib/utils";

export default function InvoicesPage() {
  // Basic fetch for fallback stats count if needed, or rely on stats hook.
  const { data: invoicesData } = useInvoices({ limit: 1000 });
  const invoices = invoicesData || [];

  const { data: statistics, isLoading: isLoadingStats } =
    useInvoiceStatistics();

  const stats = [
    {
      label: "Total Invoices",
      value: invoices.length,
      icon: FileText,
      color: "text-slate-700",
      bgColor: "bg-slate-100",
    },
    {
      label: "Paid",
      value: statistics?.find((s) => s.status === "paid")?.count || 0,
      amount: statistics?.find((s) => s.status === "paid")?.totalAmount || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Pending",
      value: statistics?.find((s) => s.status === "pending")?.count || 0,
      amount: statistics?.find((s) => s.status === "pending")?.totalAmount || 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Overdue",
      value: statistics?.find((s) => s.status === "overdue")?.count || 0,
      amount: statistics?.find((s) => s.status === "overdue")?.totalAmount || 0,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              Invoices
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage rent invoices and payments
            </p>
          </div>
        </div>
      </div>

      <MaxContainer className="py-8 space-y-8">
        {/* Stats Row */}
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoadingStats ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Skeleton className="h-24 w-full rounded-sm" key={i} />
                ))}
              </>
            ) : (
              stats.map((stat, index) => (
                <Card
                  key={index}
                  className="border border-slate-200 shadow-sm bg-white rounded-sm overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                          {stat.label}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                            {stat.amount !== undefined
                              ? formatCurrency(Number(stat.amount))
                              : stat.value}
                          </p>
                          {stat.amount !== undefined && (
                            <span className="text-xs font-medium text-slate-400">
                              / {stat.value}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`h-8 w-8 rounded-full ${stat.bgColor} flex items-center justify-center shrink-0`}
                      >
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <InvoicesTable />
        </div>
      </MaxContainer>
    </div>
  );
}
