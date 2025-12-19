"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Grid3x3, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { propertyService } from "~/services";
import { useUnitFormStore } from "~/stores/useUnitFormStore";
import { BatchUnitForm } from "./BatchUnitForm";
import { SingleUnitForm } from "./SingleUnitForm";

interface UnitCreationFormProps {
  propertyId: string;
}

export function UnitCreationForm({ propertyId }: UnitCreationFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"single" | "batch">("single");

  const { unitData, batchTemplate, generatedUnits, resetBatchTemplate } =
    useUnitFormStore();

  const createUnitsMutation = useMutation({
    mutationFn: async (units: any[]) => {
      const unitsData = units.map((u) => ({
        ...u,
        code: u.code || u.name,
        rentAmount:
          typeof u.rentAmount === "string"
            ? parseFloat(u.rentAmount)
            : u.rentAmount,
        type: u.type.toLowerCase(),
      }));
      if (unitsData.length === 1) {
        return propertyService.createUnit(propertyId.toString(), unitsData[0]);
      }
      return propertyService.createUnits(propertyId.toString(), unitsData);
    },
    onSuccess: (data) => {
      const count = Array.isArray(data) ? data.length : 1;
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyId],
      });
      resetBatchTemplate();
      toast.success(
        `Successfully created ${count} unit${count > 1 ? "s" : ""}!`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create units");
    },
  });

  const handleSubmit = () => {
    if (mode === "single") {
      // Validate single unit
      if (!unitData.code || !unitData.type || !unitData.rentAmount) {
        toast.error("Please fill in all required fields (Code, Type, Rent)");
        return;
      }
      createUnitsMutation.mutate([unitData]);
    } else {
      // Validate batch
      if (generatedUnits.length === 0) {
        toast.error("Please generate units from the template first");
        return;
      }
      if (!batchTemplate.type || !batchTemplate.rentAmount) {
        toast.error("Please fill in all required template fields");
        return;
      }
      createUnitsMutation.mutate(generatedUnits);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Mode Selector - Linear Radio Groups */}
      <div className="grid grid-cols-2 gap-6 p-8 border-b border-slate-100">
        <button
          onClick={() => setMode("single")}
          className={cn(
            "text-left p-6 rounded-sm border transition-all duration-200 relative group outline-none",
            mode === "single"
              ? "active-card-border bg-slate-50"
              : "border-slate-200 hover:border-slate-300 bg-white"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "h-8 w-8 rounded-sm flex items-center justify-center transition-colors",
                mode === "single"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
              )}
            >
              <Users className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <h3
              className={cn(
                "font-bold text-sm uppercase tracking-wider",
                mode === "single" ? "text-slate-900" : "text-slate-500"
              )}
            >
              Single Unit
            </h3>
          </div>
          <p className="text-xs text-slate-500 pl-11">
            Add one unit at a time (e.g. Villa)
          </p>
          {mode === "single" && (
            <div className="absolute top-3 right-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          )}
        </button>

        <button
          onClick={() => setMode("batch")}
          className={cn(
            "text-left p-6 rounded-sm border transition-all duration-200 relative group outline-none",
            mode === "batch"
              ? "active-card-border bg-slate-50"
              : "border-slate-200 hover:border-slate-300 bg-white"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "h-8 w-8 rounded-sm flex items-center justify-center transition-colors",
                mode === "batch"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
              )}
            >
              <Grid3x3 className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <h3
              className={cn(
                "font-bold text-sm uppercase tracking-wider",
                mode === "batch" ? "text-slate-900" : "text-slate-500"
              )}
            >
              Batch Generator
            </h3>
          </div>
          <p className="text-xs text-slate-500 pl-11">
            Create multiple similar units at once
          </p>
          {mode === "batch" && (
            <div className="absolute top-3 right-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          )}
        </button>
      </div>

      {/* Form Area */}
      <div className="p-8 min-h-[400px]">
        {mode === "single" ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SingleUnitForm />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BatchUnitForm />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <Button
          variant="ghost"
          onClick={() => router.push(`/properties/${propertyId}`)}
          disabled={createUnitsMutation.isPending}
          className="uppercase tracking-wider text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          Cancel
        </Button>

        <div className="flex items-center gap-4">
          {mode === "batch" && generatedUnits.length > 0 && (
            <div className="text-sm font-medium text-slate-500">
              Ready to create{" "}
              <span className="text-slate-900 font-bold">
                {generatedUnits.length}
              </span>{" "}
              units
            </div>
          )}
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={createUnitsMutation.isPending}
            className="rounded-sm bg-slate-900 text-white hover:bg-slate-800 shadow-none uppercase tracking-widest text-xs font-semibold h-10 px-8"
          >
            {createUnitsMutation.isPending ? (
              "Creating..."
            ) : (
              <>
                {mode === "single" ? "Create Unit" : "Confirm & Create"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
