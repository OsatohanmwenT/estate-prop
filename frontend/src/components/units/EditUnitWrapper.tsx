"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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
    <div className="space-y-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
          Edit Unit Details
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Update the information for this unit.
        </p>
      </div>

      <SingleUnitForm />

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={updateUnitMutation.isPending}
          className="rounded-sm border-slate-200"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={updateUnitMutation.isPending}
          className="rounded-sm bg-slate-900 text-white hover:bg-slate-800 min-w-[140px]"
        >
          {updateUnitMutation.isPending ? "Updating..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
