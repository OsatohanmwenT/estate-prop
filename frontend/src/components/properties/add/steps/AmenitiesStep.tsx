"use client";

import { Controller, Control, FieldValues } from "react-hook-form";
import { Check } from "lucide-react";
import { Field, FieldError } from "~/components/ui/field";
import { AMENITIES_LIST } from "~/constants/property";
import { cn } from "~/lib/utils";

interface AmenitiesStepProps {
  control: Control<FieldValues>;
  watch: any;
  setValue: any;
}

export function AmenitiesStep({ control }: AmenitiesStepProps) {
  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-slate-100 pb-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Amenities & Features
        </h3>
        <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-1">
          Select the facilities available at this property
        </p>
      </div>

      <Controller
        name="amenities"
        control={control}
        render={({ field, fieldState }) => {
          const selectedAmenities: string[] = field.value || [];

          const toggleAmenity = (amenityId: string) => {
            const isSelected = selectedAmenities.includes(amenityId);
            const updated = isSelected
              ? selectedAmenities.filter((id) => id !== amenityId)
              : [...selectedAmenities, amenityId];
            field.onChange(updated);
          };

          return (
            <Field data-invalid={fieldState.invalid}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {AMENITIES_LIST.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = selectedAmenities.includes(amenity.id);

                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(amenity.id)}
                      className={cn(
                        "group flex items-center gap-3 p-4 rounded-sm border transition-all duration-200 outline-none",
                        isSelected
                          ? "border-slate-900 bg-slate-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-sm transition-colors",
                          isSelected
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
                        )}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 text-left">
                        <p
                          className={cn(
                            "text-xs font-semibold uppercase tracking-wider",
                            isSelected ? "text-slate-900" : "text-slate-500"
                          )}
                        >
                          {amenity.label}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                          isSelected
                            ? "border-slate-900 bg-slate-900"
                            : "border-slate-300"
                        )}
                      >
                        {isSelected && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="mt-4 text-xs text-red-500"
                />
              )}
            </Field>
          );
        }}
      />
    </div>
  );
}
