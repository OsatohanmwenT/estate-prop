"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useAuth } from "~/contexts/AuthContext";
import { FullOwnerData, fullOwnerSchema } from "~/schemas/owner";
import { ownerService } from "~/services";
import { CreateOwnerData } from "~/types/tenant";

export default function AddOwnerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<FullOwnerData>({
    resolver: zodResolver(fullOwnerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const formData = watch();

  const createOwnerMutation = useMutation({
    mutationFn: (data: CreateOwnerData) => ownerService.createOwner(data),
    onSuccess: (data) => {
      toast.success("Owner created successfully");
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      router.push(`/owners/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create owner");
    },
  });

  const onSubmit = (data: FullOwnerData) => {
    if (!user?.organizationId) {
      toast.error("Organization ID is missing. Please log in again.");
      return;
    }

    createOwnerMutation.mutate({
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      bankName: data.bankName?.trim() || undefined,
      accountNumber: data.accountNumber?.trim() || undefined,
      accountName: data.accountName?.trim() || undefined,
      organizationId: user.organizationId,
      managedBy: user.id,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/30 font-sans">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/people")}
              className="h-8 w-8 rounded-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Owner
              </h1>
              <p className="text-xs text-slate-500">
                Create a new property owner profile
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="p-2 bg-slate-100 rounded-md">
                <UserPlus className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Owner Information
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the owner&apos;s details below
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
                  disabled={createOwnerMutation.isPending}
                  maxLength={256}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500">
                    {errors.fullName.message}
                  </p>
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
                  disabled={createOwnerMutation.isPending}
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
                  disabled={createOwnerMutation.isPending}
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
                  disabled={createOwnerMutation.isPending}
                  rows={3}
                  maxLength={512}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-xs text-red-500">
                    {errors.address.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.address?.length || 0}/512 characters
                </p>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="pt-6 border-t border-slate-200">
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
                      disabled={createOwnerMutation.isPending}
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
                      disabled={createOwnerMutation.isPending}
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
                      disabled={createOwnerMutation.isPending}
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
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/people")}
                disabled={createOwnerMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createOwnerMutation.isPending}
                className="bg-slate-900 hover:bg-slate-800"
              >
                {createOwnerMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Owner
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
