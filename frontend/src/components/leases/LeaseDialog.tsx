"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRenewLease, useTerminateLease } from "~/lib/query/leases";
import { formatCurrency, formatDate } from "~/lib/utils";
import { LeaseWithDetails } from "~/types/lease";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface LeaseDialogProps {
  type: "TERMINATE" | "RENEW";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: string;
  lease: LeaseWithDetails | null;
  onSuccess?: () => void;
}

const LeaseDialog = ({
  type,
  open,
  onOpenChange,
  leaseId,
  lease,
  onSuccess,
}: LeaseDialogProps) => {
  const [terminationReason, setTerminationReason] = useState("");

  const terminateLease = useTerminateLease();
  const renewLease = useRenewLease();

  const handleClose = () => {
    onOpenChange(false);
    setTerminationReason("");
  };

  const confirmTermination = async () => {
    try {
      await terminateLease.mutateAsync({
        id: leaseId,
        data: {
          terminationDate: new Date().toISOString().split("T")[0],
          reason: terminationReason,
        },
      });
      toast.success("Lease terminated successfully");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to terminate lease");
    }
  };

  const confirmRenewal = async () => {
    if (!lease) return;

    const currentEndDate = new Date(lease.endDate);
    const newStartDate = new Date(currentEndDate);
    newStartDate.setDate(newStartDate.getDate() + 1);

    const newEndDate = new Date(newStartDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    try {
      await renewLease.mutateAsync({
        id: leaseId,
        data: {
          startDate: newStartDate.toISOString().split("T")[0],
          endDate: newEndDate.toISOString().split("T")[0],
          rentAmount: parseFloat(lease.rentAmount),
          billingCycle: lease.billingCycle,
          agencyFee: lease.agencyFee ? parseFloat(lease.agencyFee) : undefined,
          legalFee: lease.legalFee ? parseFloat(lease.legalFee) : undefined,
          cautionDeposit: lease.cautionDeposit
            ? parseFloat(lease.cautionDeposit)
            : undefined,
        },
      });
      toast.success("Lease renewed successfully");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to renew lease");
    }
  };

  if (type === "TERMINATE") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate Lease</DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate this lease? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {lease && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2 bg-slate-50">
                <p className="text-sm">
                  <span className="font-medium">Tenant:</span>{" "}
                  {lease.tenant?.fullName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Property:</span>{" "}
                  {lease.property?.name} - {lease.unit?.code}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Current End Date:</span>{" "}
                  {formatDate(lease.endDate)}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Reason for Termination (Optional)</Label>
                <Textarea
                  placeholder="Enter reason for termination..."
                  value={terminationReason}
                  onChange={(e) => setTerminationReason(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmTermination}
              disabled={terminateLease.isPending}
            >
              {terminateLease.isPending ? "Terminating..." : "Terminate Lease"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // RENEW Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew Lease</DialogTitle>
          <DialogDescription>
            Create a new lease based on the current terms
          </DialogDescription>
        </DialogHeader>
        {lease && (
          <div className="space-y-4">
            <div className="rounded-sm border p-4 space-y-2 bg-slate-50/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Tenant
                  </p>
                  <p className="text-sm font-medium">
                    {lease.tenant?.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Unit
                  </p>
                  <p className="text-sm font-medium">{lease.unit?.code}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Current Rent
                  </p>
                  <p className="text-sm font-medium">
                    {formatCurrency(parseFloat(lease.rentAmount))} /{" "}
                    {lease.billingCycle}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-sm border-l-2 p-3 bg-emerald-50 border-emerald-500">
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-1">
                Quick Renewal
              </p>
              <p className="text-xs text-emerald-700 leading-snug">
                Extends lease by 1 year from the current end date at the same
                rate.
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Link href={`/leases/add?renewFrom=${leaseId}`}>
            <Button variant="outline">Customize Terms</Button>
          </Link>
          <Button onClick={confirmRenewal} disabled={renewLease.isPending}>
            {renewLease.isPending ? "Renewing..." : "Quick Renew (1 Year)"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaseDialog;
