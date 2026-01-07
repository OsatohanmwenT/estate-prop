"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2, User } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { FullOwnerData, fullOwnerSchema } from "~/schemas/owner";
import { Owner, UpdateOwnerData } from "~/types/tenant";

interface EditOwnerFormProps {
  owner: Owner;
  onSubmit: (data: UpdateOwnerData) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

export function EditOwnerForm({
  owner,
  onSubmit,
  onDelete,
  isLoading = false,
  isDeleting = false,
}: EditOwnerFormProps) {
  const form = useForm<FullOwnerData>({
    resolver: zodResolver(fullOwnerSchema),
    defaultValues: {
      fullName: owner.fullName || "",
      email: owner.email || "",
      phone: owner.phone || "",
      address: owner.address || "",
      bankName: owner.bankName || "",
      accountNumber: owner.accountNumber || "",
      accountName: owner.accountName || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const formData = watch();

  const onFormSubmit = (data: FullOwnerData) => {
    onSubmit({
      fullName: data.fullName.trim(),
      email: data.email?.trim().toLowerCase() || "",
      phone: data.phone?.trim() || "",
      address: data.address?.trim() || "",
      bankName: data.bankName?.trim() || undefined,
      accountNumber: data.accountNumber?.trim() || undefined,
      accountName: data.accountName?.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="p-2 bg-slate-100 rounded-md">
          <User className="h-5 w-5 text-slate-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Owner Information
          </h3>
          <p className="text-xs text-slate-500">
            Update the owner&apos;s details below
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            {...register("fullName")}
            disabled={isLoading || isDeleting}
            maxLength={256}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData.fullName?.length || 0}/256 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            disabled={isLoading || isDeleting}
            maxLength={256}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+234 xxx xxx xxxx"
            {...register("phone")}
            disabled={isLoading || isDeleting}
            maxLength={50}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="address"
            placeholder="Enter full address"
            {...register("address")}
            disabled={isLoading || isDeleting}
            rows={3}
            maxLength={512}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData.address?.length || 0}/512 characters
          </p>
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="pt-4 border-t border-slate-200">
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">
              Bank Details (Optional)
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Add bank account information for receiving payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Enter bank name"
                {...register("bankName")}
                disabled={isLoading || isDeleting}
                maxLength={100}
                className={errors.bankName ? "border-red-500" : ""}
              />
              {errors.bankName && (
                <p className="text-xs text-red-500">
                  {errors.bankName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                {...register("accountNumber")}
                disabled={isLoading || isDeleting}
                maxLength={20}
                className={errors.accountNumber ? "border-red-500" : ""}
              />
              {errors.accountNumber && (
                <p className="text-xs text-red-500">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                placeholder="Enter account name"
                {...register("accountName")}
                disabled={isLoading || isDeleting}
                maxLength={256}
                className={errors.accountName ? "border-red-500" : ""}
              />
              {errors.accountName && (
                <p className="text-xs text-red-500">
                  {errors.accountName.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                disabled={isLoading || isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete Owner
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  owner and remove their data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <div className="flex gap-3 ml-auto">
          <Button
            type="submit"
            disabled={isLoading || isDeleting}
            className="bg-slate-900 hover:bg-slate-800"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
