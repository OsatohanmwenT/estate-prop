"use client";

import { Control, Controller, FieldValues, FormState } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { NIGERIAN_STATES, PROPERTY_TYPES } from "~/constants/property";
import { cn } from "~/lib/utils";
import { OwnerComboBox } from "./inputs/OwnerComboBox";

interface AddressStepProps {
  control: Control<FieldValues>;
  formState: FormState<FieldValues>;
}

const MAX_NAME_LENGTH = 256;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_ADDRESS_LENGTH = 512;
const MAX_CITY_LGA_LENGTH = 100;

export function AddressStep({ control, formState }: AddressStepProps) {
  return (
    <div className="space-y-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Section: Property Basic Info */}
      <section>
        <div className="mb-8 border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Property Details
          </h3>
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-1">
            Basic information about the asset
          </p>
        </div>

        <div className="space-y-6">
          {/* Property Name */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="property-name"
                  className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
                >
                  Property Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="property-name"
                  className="bg-white border-slate-200 rounded-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors h-10 text-sm"
                  placeholder="e.g., Chief Ade's Bungalow"
                  maxLength={MAX_NAME_LENGTH}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription
                  id="property-name-description"
                  className="text-[10px] text-slate-400"
                >
                  {field.value?.length || 0}/{MAX_NAME_LENGTH} characters
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError
                    id="property-name-error"
                    errors={[fieldState.error]}
                    className="text-xs text-red-500"
                  />
                )}
              </Field>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="description"
                  className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
                >
                  Description
                </FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  className="bg-white border-slate-200 rounded-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors min-h-[100px] resize-none text-sm"
                  placeholder="Brief description of the structure and key selling points..."
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription
                  id="description-description"
                  className="text-[10px] text-slate-400"
                >
                  {field.value?.length || 0}/{MAX_DESCRIPTION_LENGTH} characters
                </FieldDescription>
              </Field>
            )}
          />

          {/* Property Category */}
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="gap-3" data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Property Category <span className="text-red-500">*</span>
                </FieldLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PROPERTY_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = field.value === type.id;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => field.onChange(type.id)}
                        className={cn(
                          "p-4 border rounded-sm flex flex-col items-center gap-2 transition-all hover:border-slate-400 focus:outline-none",
                          isSelected
                            ? "border-slate-900 bg-slate-50 text-slate-900"
                            : "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
                        )}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="text-xs text-red-500"
                  />
                )}
              </Field>
            )}
          />

          {/* Owner Selection */}
          <Controller
            name="ownerId"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Owner
                </FieldLabel>
                <OwnerComboBox
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              </Field>
            )}
          />
        </div>
      </section>

      {/* Section: Address Information */}
      <section>
        <div className="mb-8 border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Location Data
          </h3>
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-1">
            Where is this asset located?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Street Address */}
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                className="gap-2 md:col-span-2"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel
                  htmlFor="street-address"
                  className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
                >
                  Street Address <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="street-address"
                  className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
                  placeholder="e.g., 123 Main Street"
                  maxLength={MAX_ADDRESS_LENGTH}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="text-xs text-red-500"
                  />
                )}
              </Field>
            )}
          />

          {/* City */}
          <Controller
            name="city"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="city"
                  className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
                >
                  City <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="city"
                  className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
                  placeholder="Lagos"
                  maxLength={MAX_CITY_LGA_LENGTH}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />

          {/* Area/LGA */}
          <Controller
            name="lga"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="area-lga"
                  className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
                >
                  Area/LGA
                </FieldLabel>
                <Input
                  {...field}
                  id="area-lga"
                  className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
                  placeholder="Ikeja"
                  maxLength={MAX_CITY_LGA_LENGTH}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />

          {/* State */}
          <Controller
            name="state"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                className="gap-2 md:col-span-2"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel
                  htmlFor="state"
                  className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
                >
                  State <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={formState.isSubmitting}
                >
                  <SelectTrigger
                    id="state"
                    className="bg-white w-full border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-200">
                    {NIGERIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="text-xs text-red-500"
                  />
                )}
              </Field>
            )}
          />
        </div>
      </section>
    </div>
  );
}
