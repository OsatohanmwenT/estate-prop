"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap } from "lucide-react";
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
  SheetTrigger,
} from "~/components/ui/sheet";
import { unitTypes } from "~/constants/unit";
import { propertyService } from "~/services";
import { CreateUnitData } from "~/types/unit";

interface QuickAddUnitSheetProps {
  propertyId: number;
  trigger?: React.ReactNode;
}

const UNIT_TYPE_DEFAULTS: Record<string, Partial<CreateUnitData>> = {
  Studio: { bedrooms: 0, bathrooms: 1, unitSize: 400, floor: 1 },
  "1 Bedroom": { bedrooms: 1, bathrooms: 1, unitSize: 600, floor: 1 },
  "2 Bedroom": { bedrooms: 2, bathrooms: 2, unitSize: 900, floor: 1 },
  "3 Bedroom": { bedrooms: 3, bathrooms: 2, unitSize: 1200, floor: 1 },
  Shop: { bedrooms: 0, bathrooms: 1, unitSize: 500, floor: 0 },
  Office: { bedrooms: 0, bathrooms: 1, unitSize: 800, floor: 1 },
};

export function QuickAddUnitSheet({
  propertyId,
  trigger,
}: QuickAddUnitSheetProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    code: "",
    type: "",
    rentAmount: "",
  });

  const createUnitMutation = useMutation({
    mutationFn: async (data: any) => {
      return propertyService.createUnit(propertyId.toString(), data);
    },
    onSuccess: () => {
      toast.success("Unit created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyId],
      });
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setFormData({ code: "", type: "", rentAmount: "" });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create unit");
    },
  });

  const handleSubmit = () => {
    if (!formData.code || !formData.type || !formData.rentAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const defaults = UNIT_TYPE_DEFAULTS[formData.type] || {
      bedrooms: 1,
      bathrooms: 1,
      unitSize: 800,
      floor: 1,
    };

    const unitData: any = {
      name: formData.code,
      type: formData.type,
      rentAmount: parseFloat(formData.rentAmount),
      bedrooms: defaults.bedrooms!,
      bathrooms: defaults.bathrooms!,
      unitSize: defaults.unitSize!,
      floor: defaults.floor!,
      status: "vacant",
      condition: "good",
      images: [],
    };

    createUnitMutation.mutate(unitData);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            Quick Add Unit
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Add Unit
          </SheetTitle>
          <SheetDescription>
            Add a unit with smart defaults based on type. You can customize
            details later.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 py-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-name">
              Unit Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quick-name"
              placeholder="e.g., Flat A1, Shop 5"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-type">
              Unit Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger id="quick-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.type && UNIT_TYPE_DEFAULTS[formData.type] && (
              <p className="text-xs text-muted-foreground">
                Auto-fills: {UNIT_TYPE_DEFAULTS[formData.type].bedrooms} bed,{" "}
                {UNIT_TYPE_DEFAULTS[formData.type].bathrooms} bath,{" "}
                {UNIT_TYPE_DEFAULTS[formData.type].unitSize} sq ft
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-rent">
              Monthly Rent <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quick-rent"
              type="number"
              placeholder="e.g., 150000"
              value={formData.rentAmount}
              onChange={(e) =>
                setFormData({ ...formData, rentAmount: e.target.value })
              }
            />
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
            {createUnitMutation.isPending ? "Creating..." : "Create Unit"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
