"use client";

import { CheckCircle2, Eye, Plus, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { QuickAddUnitSheet } from "./QuickAddUnitSheet";

interface UnitsCreatedSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: number;
  unitsCreated: number;
}

export function UnitsCreatedSheet({
  open,
  onOpenChange,
  propertyId,
  unitsCreated,
}: UnitsCreatedSheetProps) {
  const router = useRouter();

  const handleViewProperty = () => {
    router.push(`/properties/${propertyId}`);
    onOpenChange(false);
  };

  const handleAddMore = () => {
    router.push(`/properties/${propertyId}/units/add`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <SheetTitle className="text-center">
            {unitsCreated} Unit{unitsCreated > 1 ? "s" : ""} Created!
          </SheetTitle>
          <SheetDescription className="text-center">
            Your units have been successfully added to the property.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 py-6">
          <div className="space-y-3">
            <QuickAddUnitSheet
              propertyId={propertyId}
              trigger={
                <Button size="lg" className="w-full gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Add Another Unit
                </Button>
              }
            />

            <Button
              onClick={handleAddMore}
              variant="outline"
              size="lg"
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add More Units (Full Form)
            </Button>

            <Button
              onClick={handleViewProperty}
              variant="outline"
              size="lg"
              className="w-full gap-2"
            >
              <Eye className="h-4 w-4" />
              View Property Details
            </Button>
          </div>
        </div>

        <SheetFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            You can always add more units from the property page
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
