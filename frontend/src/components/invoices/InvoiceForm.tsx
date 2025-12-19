"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CreateInvoiceFormData,
  createInvoiceSchema,
  INVOICE_STATUSES,
  INVOICE_TYPES,
} from "~/schemas/invoice";
import { Invoice } from "~/types/invoice";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface InvoiceFormProps {
  initialData?: Invoice;
  onSubmit: (data: CreateInvoiceFormData) => void;
  isLoading?: boolean;
  tenants?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  }>;
  leases?: Array<{
    id: string;
    tenantId?: string;
    unit: {
      code: string;
      unitNumber?: string;
      property?: { name: string };
    } | null;
  }>;
}

export function InvoiceForm({
  initialData,
  onSubmit,
  isLoading,
  tenants = [],
  leases = [],
}: InvoiceFormProps) {
  const form = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema) as any,
    defaultValues: initialData
      ? {
          tenantId: initialData.tenantId,
          leaseId: initialData.leaseId || undefined,
          type: initialData.type,
          description: initialData.description,
          amount: Number(initialData.amount),
          dueDate: initialData.dueDate,
          status: initialData.status,
          ownerAmount: initialData.ownerAmount
            ? Number(initialData.ownerAmount)
            : undefined,
          managementFee: initialData.managementFee
            ? Number(initialData.managementFee)
            : undefined,
        }
      : {
          tenantId: "",
          type: "rent",
          description: "",
          amount: 0,
          dueDate: format(new Date(), "yyyy-MM-dd"),
          status: "draft",
        },
  });

  const selectedTenantId = form.watch("tenantId");

  // Filter leases based on selected tenant
  const filteredLeases = leases.filter(
    (lease: any) => lease.tenantId === selectedTenantId
  );

  // Reset lease selection when tenant changes
  useEffect(() => {
    if (initialData) return; // Don't reset when editing
    form.setValue("leaseId", undefined);
  }, [selectedTenantId, form, initialData]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tenant Selection */}
        <Field>
          <FieldLabel>Tenant *</FieldLabel>
          <Controller
            name="tenantId"
            control={form.control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.fullName ||
                        `${tenant.firstName} ${tenant.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.tenantId && (
            <FieldError>{form.formState.errors.tenantId.message}</FieldError>
          )}
        </Field>

        {/* Lease Selection (Optional) */}
        <Field>
          <FieldLabel>Lease (Optional)</FieldLabel>
          <Controller
            name="leaseId"
            control={form.control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
                disabled={isLoading || !selectedTenantId}
              >
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Select a lease" />
                </SelectTrigger>
                <SelectContent>
                  {filteredLeases.map((lease: any) => (
                    <SelectItem key={lease.id} value={lease.id}>
                      {lease.unit?.property?.name || "Unknown Property"} - Unit{" "}
                      {lease.unit?.unitNumber || lease.unit?.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Select a lease to link this invoice to a property
          </p>
          {form.formState.errors.leaseId && (
            <FieldError>{form.formState.errors.leaseId.message}</FieldError>
          )}
        </Field>

        {/* Invoice Type */}
        <Field>
          <FieldLabel>Invoice Type *</FieldLabel>
          <Controller
            name="type"
            control={form.control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Select invoice type" />
                </SelectTrigger>
                <SelectContent>
                  {INVOICE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.type && (
            <FieldError>{form.formState.errors.type.message}</FieldError>
          )}
        </Field>

        {/* Status */}
        <Field>
          <FieldLabel>Status *</FieldLabel>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {INVOICE_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.status && (
            <FieldError>{form.formState.errors.status.message}</FieldError>
          )}
        </Field>

        {/* Amount */}
        <Field>
          <FieldLabel>Amount *</FieldLabel>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="rounded-sm"
            disabled={isLoading}
            {...form.register("amount", { valueAsNumber: true })}
          />
          {form.formState.errors.amount && (
            <FieldError>{form.formState.errors.amount.message}</FieldError>
          )}
        </Field>

        {/* Due Date */}
        <Field>
          <FieldLabel>Due Date *</FieldLabel>
          <Controller
            name="dueDate"
            control={form.control}
            render={({ field }) => (
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onSelect={(date: Date | undefined) =>
                  field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)
                }
                disabled={isLoading}
                placeholder="Pick a date"
              />
            )}
          />
          {form.formState.errors.dueDate && (
            <FieldError>{form.formState.errors.dueDate.message}</FieldError>
          )}
        </Field>
      </div>

      {/* Description */}
      <Field>
        <FieldLabel>Description *</FieldLabel>
        <Textarea
          placeholder="Enter invoice description..."
          className="rounded-sm resize-none"
          rows={4}
          disabled={isLoading}
          {...form.register("description")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Provide details about this invoice
        </p>
        {form.formState.errors.description && (
          <FieldError>{form.formState.errors.description.message}</FieldError>
        )}
      </Field>

      {/* Optional Management Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>Owner Amount (Optional)</FieldLabel>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="rounded-sm"
            disabled={isLoading}
            {...form.register("ownerAmount", { valueAsNumber: true })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Amount to be paid to property owner
          </p>
          {form.formState.errors.ownerAmount && (
            <FieldError>{form.formState.errors.ownerAmount.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Management Fee (Optional)</FieldLabel>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            className="rounded-sm"
            disabled={isLoading}
            {...form.register("managementFee", { valueAsNumber: true })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Management commission amount
          </p>
          {form.formState.errors.managementFee && (
            <FieldError>
              {form.formState.errors.managementFee.message}
            </FieldError>
          )}
        </Field>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-sm bg-slate-900 hover:bg-slate-800"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
