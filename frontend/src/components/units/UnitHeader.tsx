"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { unitService } from "~/services/unitService";
import { Unit } from "~/types/property";

interface UnitHeaderProps {
  unit: Unit;
  propertyId: string;
}

export function UnitHeader({ unit, propertyId }: UnitHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteUnitMutation = useMutation({
    mutationFn: () => unitService.deleteUnit(propertyId, unit.id),
    onSuccess: () => {
      toast.success("Unit deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyId],
      });
      router.push(`/properties/${propertyId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete unit");
      setIsDeleteDialogOpen(false);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "occupied":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900";
      case "vacant":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900";
      case "maintenance":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link
            href={`/properties/${propertyId}`}
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Property
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{unit.name}</h1>
          <Badge
            variant="outline"
            className={`${getStatusColor(unit.status)} font-normal px-2.5 py-0.5`}
          >
            {unit.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {unit.floor} Floor • {unit.type}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <Link href={`/properties/${propertyId}/units/${unit.id}/edit`}>
            <Edit className="h-4 w-4" />
            Edit Unit
          </Link>
        </Button>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                unit and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  deleteUnitMutation.mutate();
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleteUnitMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
