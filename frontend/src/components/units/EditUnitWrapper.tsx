"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { SingleUnitForm } from "~/components/units/SingleUnitForm";
import { unitService } from "~/services";
import { useUnitFormStore } from "~/stores/useUnitFormStore";
import { Unit, UpdateUnitData } from "~/types/unit";

interface EditUnitWrapperProps {
  unit: Unit;
  propertyId: string;
}

export function EditUnitWrapper({ unit, propertyId }: EditUnitWrapperProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { unitData, setUnitData, resetForm } = useUnitFormStore();

  useEffect(() => {
    setUnitData({
      code: unit.code,
      type: unit.type,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      floor: unit.floor,
      unitSize: unit.unitSize,
      rentAmount: unit.rentAmount,
      condition: unit.condition,
    });

    return () => resetForm();
  }, [unit, setUnitData, resetForm]);

  const updateUnitMutation = useMutation({
    mutationFn: (data: UpdateUnitData) =>
      unitService.updateUnit(propertyId, unit.id, data),
    onSuccess: () => {
      toast.success("Unit updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyId],
      });
      queryClient.invalidateQueries({ queryKey: ["unit", unit.id] });
      router.push(`/properties/${propertyId}/units/${unit.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update unit");
    },
  });

  const handleSubmit = () => {
    if (!unitData.code || !unitData.type || !unitData.rentAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateUnitMutation.mutate(unitData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Edit Unit Details</h2>
          <p className="text-sm text-muted-foreground">
            Update the information for this unit.
          </p>
        </div>

        <SingleUnitForm />

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={updateUnitMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateUnitMutation.isPending}
          >
            {updateUnitMutation.isPending ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
