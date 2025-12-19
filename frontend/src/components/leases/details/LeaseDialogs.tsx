"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { formatCurrency, formatDate } from "~/lib/utils";

interface LeaseDialogsProps {
  leaseId: string;
  // Terminate dialog props
  terminateOpen: boolean;
  onTerminateOpenChange: (open: boolean) => void;
  terminationReason: string;
  onTerminationReasonChange: (reason: string) => void;
  onTerminateConfirm: () => void;
  isTerminating: boolean;
  // Renew dialog props
  renewOpen: boolean;
  onRenewOpenChange: (open: boolean) => void;
  onRenewConfirm: () => void;
  isRenewing: boolean;
  renewData: {
    startDate: string;
    rentAmount: number;
  };
}

export function LeaseDialogs({
  leaseId,
  terminateOpen,
  onTerminateOpenChange,
  terminationReason,
  onTerminationReasonChange,
  onTerminateConfirm,
  isTerminating,
  renewOpen,
  onRenewOpenChange,
  onRenewConfirm,
  isRenewing,
  renewData,
}: LeaseDialogsProps) {
  return (
    <>
      {/* Terminate Dialog */}
      <Dialog open={terminateOpen} onOpenChange={onTerminateOpenChange}>
        <DialogContent className="rounded-sm border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Terminate Lease</DialogTitle>
            <DialogDescription>
              This will end the lease immediately and mark the unit as vacant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Reason (Optional)
              </Label>
              <Textarea
                placeholder="Enter reason for termination..."
                value={terminationReason}
                onChange={(e) => onTerminationReasonChange(e.target.value)}
                className="bg-slate-50 border-slate-200 focus:border-slate-400 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => onTerminateOpenChange(false)}
              className="text-slate-600"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onTerminateConfirm}
              disabled={isTerminating}
              className="bg-red-600 hover:bg-red-700 rounded-sm"
            >
              {isTerminating ? "Terminating..." : "Confirm Termination"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog open={renewOpen} onOpenChange={onRenewOpenChange}>
        <DialogContent className="rounded-sm border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Renew Lease</DialogTitle>
            <DialogDescription>
              Create a new lease starting after the current one ends.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-sm border p-4 space-y-2 bg-emerald-50/50 border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                <CheckCircle2 className="h-4 w-4" />
                Quick Renewal Terms
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                New lease starts{" "}
                <span className="font-semibold text-slate-900">
                  {formatDate(renewData.startDate)}
                </span>
                .
                <br />
                Duration:{" "}
                <span className="font-semibold text-slate-900">12 Months</span>
                <br />
                Rent:{" "}
                <span className="font-semibold text-slate-900">
                  {formatCurrency(renewData.rentAmount)}
                </span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => onRenewOpenChange(false)}
              className="text-slate-600"
            >
              Cancel
            </Button>
            <Link href={`/leases/add?renewFrom=${leaseId}`}>
              <Button
                variant="outline"
                className="border-slate-200 text-slate-600 rounded-sm"
              >
                Customize
              </Button>
            </Link>
            <Button
              onClick={onRenewConfirm}
              disabled={isRenewing}
              className="bg-slate-900 text-white rounded-sm hover:bg-slate-800"
            >
              {isRenewing ? "Processing..." : "Quick Renew"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
