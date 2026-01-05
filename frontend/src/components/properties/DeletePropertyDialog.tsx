"use client";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useDeleteProperty } from "~/lib/query";

interface DeletePropertyDialogProps {
  propertyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePropertyDialog({
  propertyId,
  open,
  onOpenChange,
}: DeletePropertyDialogProps) {
  const deletePropertyMutation = useDeleteProperty();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    deletePropertyMutation.mutate(propertyId, {
      onSuccess: () => {
        toast.success("Property deleted successfully");
        onOpenChange(false);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete property");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            property and all associated data including units, tenants, and
            documents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePropertyMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
            disabled={deletePropertyMutation.isPending}
          >
            {deletePropertyMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
