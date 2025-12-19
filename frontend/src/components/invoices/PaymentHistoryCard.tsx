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
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No payments recorded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const balance = totalAmount - amountPaid;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Payment History
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {transactions.length} Payment{transactions.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Total Paid</span>
            <span className="font-semibold">
              {formatCurrency(amountPaid)} / {formatCurrency(totalAmount)}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{
                width: `${Math.min((amountPaid / totalAmount) * 100, 100)}%`,
              }}
            />
          </div>
          {balance > 0 && (
            <p className="text-xs text-slate-500">
              Remaining Balance: {formatCurrency(balance)}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {transactions.map((transaction, index) => {
            const colors =
              paymentMethodColors[transaction.method] ||
              paymentMethodColors.bank_transfer;

            return (
              <div
                key={transaction.id}
                className="relative pl-8 pb-3 last:pb-0"
              >
                {/* Timeline line */}
                {index < transactions.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-px bg-slate-200" />
                )}

                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1 h-6 w-6 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}
                >
                  <CheckCircle2 className={`h-3 w-3 ${colors.text}`} />
                </div>

                {/* Transaction Card */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full text-left hover:bg-slate-50 rounded-lg p-3 transition-colors border border-slate-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-slate-900">
                              {formatCurrency(Number(transaction.amount))}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 h-5 capitalize"
                            >
                              {transaction.method.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            {format(
                              new Date(transaction.paidAt),
                              "MMMM dd, yyyy 'at' h:mm a"
                            )}
                          </p>
                          {transaction.reference && (
                            <p className="text-xs text-slate-400 font-mono mt-1">
                              Ref: {transaction.reference}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">
                          View Details
                        </div>
                      </div>
                    </button>
                  </DialogTrigger>

                  {/* Transaction Details Dialog */}
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Payment Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Amount</p>
                          <p className="font-semibold text-lg text-slate-900">
                            {formatCurrency(Number(transaction.amount))}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Method</p>
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {transaction.method.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Date & Time</span>
                          <span className="font-medium">
                            {format(
                              new Date(transaction.paidAt),
                              "MMM dd, yyyy 'at' h:mm a"
                            )}
                          </span>
                        </div>

                        {transaction.reference && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Reference</span>
                            <span className="font-mono text-xs">
                              {transaction.reference}
                            </span>
                          </div>
                        )}

                        {transaction.bankName && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Bank</span>
                            <span className="font-medium">
                              {transaction.bankName}
                            </span>
                          </div>
                        )}

                        {transaction.accountNumber && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Account</span>
                            <span className="font-mono text-xs">
                              {transaction.accountNumber}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-slate-500">Transaction ID</span>
                          <span className="font-mono text-xs">
                            {transaction.id.substring(0, 8)}...
                          </span>
                        </div>
                      </div>

                      {transaction.receiptUrl && (
                        <div className="pt-3 border-t">
                          <Button
                            variant="outline"
                            className="w-full"
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
      </CardContent>
    </Card>
  );
}
