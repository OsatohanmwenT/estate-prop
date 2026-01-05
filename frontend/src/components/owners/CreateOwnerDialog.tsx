"use client";

import { useState } from "react";
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
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  CreateOwnerDialogProps,
  INITIAL_OWNER_FORM_DATA,
} from "~/types/owner.types";

export function CreateOwnerDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateOwnerDialogProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formData, setFormData] = useState(INITIAL_OWNER_FORM_DATA);

  const createOwnerMutation = useMutation({
    mutationFn: (data: typeof formData) => ownerService.createOwner(data),
    onSuccess: (data) => {
      toast.success("Owner created successfully");
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      onSuccess?.(data.id);
      onOpenChange(false);
      setFormData(INITIAL_OWNER_FORM_DATA);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create owner");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (formData.fullName.length < 2) {
      toast.error("Full name must be at least 2 characters");
      return;
    }
    if (formData.fullName.length > 256) {
      toast.error("Full name must not exceed 256 characters");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (formData.email.length > 256) {
      toast.error("Email must not exceed 256 characters");
      return;
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (formData.phone.length < 10) {
      toast.error("Phone number must be at least 10 characters");
      return;
    }
    if (formData.phone.length > 50) {
      toast.error("Phone number must not exceed 50 characters");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (formData.address.length < 5) {
      toast.error("Address must be at least 5 characters");
      return;
    }
    if (formData.address.length > 512) {
      toast.error("Address must not exceed 512 characters");
      return;
    }
    if (!user?.organizationId) {
      toast.error("Organization ID is missing. Please log in again.");
      return;
    }

    createOwnerMutation.mutate({
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Owner</DialogTitle>
          <DialogDescription>
            Add a new property owner to the system. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                disabled={createOwnerMutation.isPending}
                maxLength={256}
              />
              <p className="text-xs text-muted-foreground">
                {formData.fullName.length}/256 characters
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={createOwnerMutation.isPending}
                maxLength={256}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 xxx xxx xxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={createOwnerMutation.isPending}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={createOwnerMutation.isPending}
                rows={3}
                maxLength={512}
              />
              <p className="text-xs text-muted-foreground">
                {formData.address.length}/512 characters
              </p>
            </div>
          </div>

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
