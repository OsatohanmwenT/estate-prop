"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerService } from "~/services";
import { toast } from "sonner";
import { useAuth } from "~/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { CreateOwnerDialogProps } from "~/types/owner.types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ownerFormSchema, OwnerFormData } from "~/schemas/owner";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";

export function CreateOwnerDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateOwnerDialogProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<OwnerFormData>({
    resolver: zodResolver(ownerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const createOwnerMutation = useMutation({
    mutationFn: (data: OwnerFormData) => {
      // Clean up empty strings to undefined if backend prefers, OR sends as is since backend handles partials
      return ownerService.createOwner({
        fullName: data.fullName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
      });
    },
    onSuccess: (data) => {
      toast.success("Owner created successfully");
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      onSuccess?.(data.id);
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create owner");
    },
  });

  const onSubmit = (data: OwnerFormData) => {
    if (!user?.organizationId) {
      toast.error("Organization ID is missing. Please log in again.");
      return;
    }
    createOwnerMutation.mutate(data);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Owner</DialogTitle>
          <DialogDescription>
            Add a new property owner. Only full name is required for quick
            addition.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Full Name */}
          <Controller
            control={form.control}
            name="fullName"
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={createOwnerMutation.isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...field}
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                  disabled={createOwnerMutation.isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Phone */}
          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 xxx xxx xxxx"
                  {...field}
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                  disabled={createOwnerMutation.isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Address */}
          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Textarea
                  id="address"
                  placeholder="Enter full address"
                  {...field}
                  value={field.value || ""}
                  rows={3}
                  aria-invalid={fieldState.invalid}
                  disabled={createOwnerMutation.isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createOwnerMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createOwnerMutation.isPending}>
              {createOwnerMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Owner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
