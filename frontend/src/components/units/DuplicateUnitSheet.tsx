"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { conditions, unitTypes } from "~/constants/unit";
import { propertyService } from "~/services";
import { Unit } from "~/types/property";

interface DuplicateUnitSheetProps {
  unit: Unit;
  propertyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DuplicateUnitSheet({
  unit,
  propertyId,
  open,
  onOpenChange,
}: DuplicateUnitSheetProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    code: `${unit.code} (Copy)`,
    type: unit.type,
    floor: unit.floor,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    unitSize: unit.unitSize,
    rentAmount: unit.rentAmount,
    condition: unit.condition || "good",
  });

  const createUnitMutation = useMutation({
    mutationFn: async (data: any) => {
      return propertyService.createUnit(propertyId.toString(), data);
    },
    onSuccess: () => {
      toast.success("Unit duplicated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyId],
      });
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to duplicate unit");
    },
  });

  const handleSubmit = () => {
    if (!formData.code || !formData.type || !formData.rentAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const unitData: any = {
      name: formData.code,
      type: formData.type,
      floor: formData.floor,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      unitSize: formData.unitSize,
      rentAmount:
        typeof formData.rentAmount === "string"
          ? parseFloat(formData.rentAmount)
          : formData.rentAmount,
      condition: formData.condition,
      images: [],
    };

    createUnitMutation.mutate(unitData);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Duplicate Unit
          </SheetTitle>
          <SheetDescription>
            Creating a copy of <strong>{unit.code}</strong>. Adjust the details
            as needed.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="dup-name">
                Unit Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dup-name"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dup-type">
                Unit Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="dup-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dup-floor">Floor</Label>
              <Input
                id="dup-floor"
                type="number"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    floor: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dup-bedrooms">Bedrooms</Label>
              <Input
                id="dup-bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bedrooms: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dup-bathrooms">Bathrooms</Label>
              <Input
                id="dup-bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bathrooms: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dup-size">Unit Size (sq ft)</Label>
              <Input
                id="dup-size"
                type="number"
                value={formData.unitSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitSize: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dup-rent">
                Monthly Rent <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dup-rent"
                value={formData.rentAmount}
                onChange={(e) =>
                  setFormData({ ...formData, rentAmount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dup-condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    condition: value as
                      | "good"
                      | "fair"
                      | "poor"
                      | "renovation_needed",
                  })
                }
              >
                <SelectTrigger id="dup-condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" disabled={createUnitMutation.isPending}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            onClick={handleSubmit}
            disabled={createUnitMutation.isPending}
          >
            {createUnitMutation.isPending ? "Duplicating..." : "Duplicate Unit"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
