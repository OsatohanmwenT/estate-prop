"use client";

import { Building2, Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface PropertyCreatedDialogProps {
  open: boolean;
  propertyId: string;
  propertyName: string;
}

export function PropertyCreatedDialog({
  open,
  propertyId,
  propertyName,
}: PropertyCreatedDialogProps) {
  const router = useRouter();

  const handleAddUnits = () => {
    router.push(`/properties/${propertyId}/units/add`);
  };

  const handleViewProperty = () => {
    router.push(`/properties/${propertyId}`);
  };

  const handleAddAnother = () => {
    router.push("/properties/add");
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Building2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">
            Property Created Successfully!
          </DialogTitle>
          <DialogDescription className="text-center">
            <span className="font-medium text-foreground">{propertyName}</span>{" "}
            has been added to your portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleAddUnits} size="lg" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Units Now
          </Button>

          <Button
            onClick={handleViewProperty}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Property Details
          </Button>

          <Button
            onClick={handleAddAnother}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            Add Another Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
