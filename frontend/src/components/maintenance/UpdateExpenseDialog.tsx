"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Loader2, Receipt } from "lucide-react";
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
import { Textarea } from "~/components/ui/textarea";
import { Field, FieldLabel, FieldContent } from "~/components/ui/field";
import { useUpdateMaintenance } from "~/lib/query/maintenance";
import { MaintenanceRequest } from "~/types/maintenance";

interface UpdateExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest | null;
}

interface ExpenseFormData {
  actualCost: number;
  vendorNotes: string;
}

export function UpdateExpenseDialog({
  open,
  onOpenChange,
  request,
}: UpdateExpenseDialogProps) {
  const updateMutation = useUpdateMaintenance();

  const form = useForm<ExpenseFormData>({
    defaultValues: {
      actualCost: request?.actualCost ? Number(request.actualCost) : 0,
      vendorNotes: request?.vendorNotes || "",
    },
  });

  // Reset form when request changes
  const handleOpen = (isOpen: boolean) => {
    if (isOpen && request) {
      form.reset({
        actualCost: request.actualCost ? Number(request.actualCost) : 0,
        vendorNotes: request.vendorNotes || "",
      });
    }
    onOpenChange(isOpen);
  };

  const onSubmit = (data: ExpenseFormData) => {
    if (!request) return;

    updateMutation.mutate(
      {
        id: request.id,
        data: {
          actualCost: data.actualCost,
          vendorNotes: data.vendorNotes || undefined,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-slate-500" />
            Record Expense
          </DialogTitle>
          <DialogDescription>
            Add the actual cost for:{" "}
            <span className="font-medium">{request.title}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Actual Cost */}
          <Controller
            control={form.control}
            name="actualCost"
            render={({ field }) => (
              <Field>
                <FieldLabel>Actual Cost (₦)</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0.00"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : 0
                      )
                    }
                  />
                </FieldContent>
              </Field>
            )}
          />

          {/* Vendor Notes */}
          <Controller
            control={form.control}
            name="vendorNotes"
            render={({ field }) => (
              <Field>
                <FieldLabel>Vendor / Notes (Optional)</FieldLabel>
                <FieldContent>
                  <Textarea
                    {...field}
                    placeholder="e.g. Paid to John Plumbers for pipe repair..."
                    rows={3}
                  />
                </FieldContent>
              </Field>
            )}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
