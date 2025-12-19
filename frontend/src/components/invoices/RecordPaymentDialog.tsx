"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { useRecordPayment } from "~/lib/query/invoices";
import { formatCurrency } from "~/lib/utils";

import { Invoice } from "~/types/invoice";
import { DatePicker } from "../ui/date-picker";

interface RecordPaymentDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordPaymentDialog({
  invoice,
  open,
  onOpenChange,
}: RecordPaymentDialogProps) {
  const balance =
    Number(invoice.amount) - Number(invoice.amountPaid);
  
  const [formData, setFormData] = useState({
    amount: balance.toString(),
    method: "bank_transfer" as
      | "bank_transfer"
      | "cash"
      | "cheque"
      | "pos"
      | "online",
    reference: "",
    paidAt: new Date().toISOString(),
    bankName: "",
  });

  const recordPaymentMutation = useRecordPayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentAmount = parseFloat(formData.amount);
    if (
      isNaN(paymentAmount) ||
      paymentAmount <= 0 ||
      paymentAmount > balance
    ) {
      toast.error(
        `Payment amount must be between 0 and ${formatCurrency(balance)}`
      );
      return;
    }

    try {
      await recordPaymentMutation.mutateAsync({
        id: invoice.id,
        data: {
          amount: paymentAmount,
          method: formData.method,
          reference: formData.reference || undefined,
          paidAt: formData.paidAt,
          bankName: formData.bankName || undefined,
        },
      });

      toast.success("Payment recorded successfully");
      onOpenChange(false);
      
      // Reset form
      setFormData({
        amount: "",
        method: "bank_transfer",
        reference: "",
        paidAt: new Date().toISOString(),
        bankName: "",
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to record payment"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-wide">
              Record Payment
            </DialogTitle>
            <DialogDescription className="text-sm">
              Record a payment for invoice{" "}
              <span className="font-mono">
                INV-{invoice.id.slice(0, 8).toUpperCase()}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Invoice Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Amount:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCurrency(Number(invoice.amount))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Paid:</span>
                <span className="font-mono text-emerald-600">
                  {formatCurrency(Number(invoice.amountPaid))}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-900">
                  Balance Due:
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-xs uppercase tracking-wider text-slate-700"
              >
                Payment Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={balance}
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="h-11 border-slate-200 rounded-sm focus:border-slate-900 font-mono"
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label
                htmlFor="method"
                className="text-xs uppercase tracking-wider text-slate-700"
              >
                Payment Method *
              </Label>
              <Select
                value={formData.method}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, method: value })
                }
              >
                <SelectTrigger className="h-11 border-slate-200 rounded-sm focus:border-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">
                    Bank Transfer
                  </SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="pos">POS</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label
                htmlFor="paidAt"
                className="text-xs uppercase tracking-wider text-slate-700"
              >
                Payment Date *
              </Label>
              <DatePicker
                date={new Date(formData.paidAt)}
                onSelect={(date) =>
                  date &&
                  setFormData({
                    ...formData,
                    paidAt: date.toISOString(),
                  })
                }
                placeholder="Select payment date"
                maxDate={new Date()}
              />
            </div>

            {/* Reference */}
            <div className="space-y-2">
              <Label
                htmlFor="reference"
                className="text-xs uppercase tracking-wider text-slate-700"
              >
                Reference / Transaction ID
              </Label>
              <Input
                id="reference"
                type="text"
                placeholder="e.g., TRX123456789"
                value={formData.reference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reference: e.target.value,
                  })
                }
                className="h-11 border-slate-200 rounded-sm focus:border-slate-900 font-mono"
              />
            </div>

            {/* Bank Name (conditional) */}
            {(formData.method === "bank_transfer" ||
              formData.method === "cheque") && (
              <div className="space-y-2">
                <Label
                  htmlFor="bankName"
                  className="text-xs uppercase tracking-wider text-slate-700"
                >
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="e.g., First Bank"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankName: e.target.value,
                    })
                  }
                  className="h-11 border-slate-200 rounded-sm focus:border-slate-900"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-sm"
              disabled={recordPaymentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 bg-slate-900 text-white hover:bg-slate-800 rounded-sm"
              disabled={recordPaymentMutation.isPending}
            >
              {recordPaymentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
