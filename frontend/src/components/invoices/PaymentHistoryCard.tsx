"use client";

import { format } from "date-fns";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { formatCurrency } from "~/lib/utils";
import { Transaction } from "~/types/invoice";

interface PaymentHistoryCardProps {
  transactions: Transaction[];
  totalAmount: number;
  amountPaid: number;
}

const paymentMethodIcons: Record<string, React.ReactNode> = {
  bank_transfer: <CreditCard className="h-4 w-4" />,
  cash: <FileText className="h-4 w-4" />,
  cheque: <FileText className="h-4 w-4" />,
  pos: <CreditCard className="h-4 w-4" />,
  online: <CreditCard className="h-4 w-4" />,
};

const paymentMethodColors: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  bank_transfer: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  cash: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  cheque: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  pos: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  online: {
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
  },
};

export function PaymentHistoryCard({
  transactions,
  totalAmount,
  amountPaid,
}: PaymentHistoryCardProps) {
  const balance = totalAmount - amountPaid;
  const progress = Math.min((amountPaid / totalAmount) * 100, 100);

  // If no transactions, show clean empty state
  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          Payment History
        </h3>
        <div className="py-12 border border-dashed border-slate-200 rounded-sm bg-slate-50/50 flex flex-col items-center justify-center text-center">
          <Clock className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500 font-medium">
            No payments recorded
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Recorded payments will appear here with a timeline.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-slate-400" />
          Payment History
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
          {transactions.length}
        </span>
      </h3>

      {/* Progress Section */}
      <div className="bg-slate-50 border border-slate-100 rounded-sm p-5 space-y-3">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Paid
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900 font-mono">
                {formatCurrency(amountPaid)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                of {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-sm">
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {transactions.map((transaction, index) => {
          const colors =
            paymentMethodColors[transaction.method] ||
            paymentMethodColors.bank_transfer;

          return (
            <div
              key={transaction.id}
              className="relative pl-6 py-2 first:pt-0 group"
            >
              {/* Connector Line */}
              {index < transactions.length - 1 && (
                <div className="absolute left-2.5 top-6 bottom-0 w-px bg-slate-100 group-hover:bg-slate-200 transition-colors" />
              )}

              {/* Dot */}
              <div
                className={`absolute left-0 top-3 h-5 w-5 rounded-full bg-white border-2 ${colors.border} flex items-center justify-center z-10`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${colors.bg.replace("bg-", "bg-").replace("50", "500")}`}
                />
              </div>

              {/* Content */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="ml-2 p-3 rounded-sm hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group/card">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 font-mono text-sm group-hover/card:text-blue-600 transition-colors">
                        {formatCurrency(Number(transaction.amount))}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                        {format(new Date(transaction.paidAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 h-5 rounded-sm bg-slate-100 text-slate-600 border-slate-200 capitalize font-medium"
                      >
                        {transaction.method.replace(/_/g, " ")}
                      </Badge>
                      {transaction.reference && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{transaction.reference}
                        </span>
                      )}
                    </div>
                  </div>
                </DialogTrigger>

                {/* Reuse existing Dialog Content logic here, exact same as before just cleaner trigger */}
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Payment Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-sm border border-slate-100">
                      <div>
                        <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">
                          Amount
                        </p>
                        <p className="font-bold text-xl text-slate-900 font-mono">
                          {formatCurrency(Number(transaction.amount))}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">
                          Method
                        </p>
                        <Badge
                          variant="outline"
                          className="capitalize text-xs bg-white"
                        >
                          {transaction.method.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-slate-500">Date & Time</span>
                        <span className="font-medium text-slate-900">
                          {format(
                            new Date(transaction.paidAt),
                            "MMM dd, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>

                      {transaction.reference && (
                        <div className="flex justify-between py-2 border-b border-slate-50">
                          <span className="text-slate-500">Reference</span>
                          <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                            {transaction.reference}
                          </span>
                        </div>
                      )}

                      {transaction.bankName && (
                        <div className="flex justify-between py-2 border-b border-slate-50">
                          <span className="text-slate-500">Bank</span>
                          <span className="font-medium text-slate-900">
                            {transaction.bankName}
                          </span>
                        </div>
                      )}

                      {transaction.accountNumber && (
                        <div className="flex justify-between py-2 border-b border-slate-50">
                          <span className="text-slate-500">Account</span>
                          <span className="font-mono text-xs text-slate-700">
                            {transaction.accountNumber}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between py-2">
                        <span className="text-slate-500">Transaction ID</span>
                        <span className="font-mono text-xs text-slate-400">
                          {transaction.id}
                        </span>
                      </div>
                    </div>

                    {transaction.receiptUrl && (
                      <div className="pt-2">
                        <Button
                          className="w-full bg-slate-900 text-white hover:bg-slate-800"
                          onClick={() =>
                            window.open(transaction.receiptUrl!, "_blank")
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        })}
      </div>
    </div>
  );
}
