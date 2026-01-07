"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Wrench } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "~/components/ui/field";
import { useProperties } from "~/lib/query";
import { usePropertyUnits } from "~/lib/query";
import { useCreateMaintenance } from "~/lib/query/maintenance";
import {
  maintenanceTypeLabels,
  MaintenanceType,
  MaintenancePriority,
} from "~/types/maintenance";
import { Property } from "~/types/property";

const MAINTENANCE_TYPES = [
  "plumbing",
  "electrical",
  "hvac",
  "appliance",
  "structural",
  "cleaning",
  "painting",
  "landscaping",
  "security",
  "other",
] as const;

const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

interface MaintenanceFormData {
  propertyId: string;
  unitId?: string;
  title: string;
  description: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  estimatedCost?: number;
}

interface CreateMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMaintenanceDialog({
  open,
  onOpenChange,
}: CreateMaintenanceDialogProps) {
  const { data: propertiesResponse } = useProperties();
  const properties =
    (propertiesResponse as any)?.data || propertiesResponse || [];
  const createMutation = useCreateMaintenance();

  const form = useForm<MaintenanceFormData>({
    defaultValues: {
      propertyId: "",
      unitId: "",
      title: "",
      description: "",
      type: "other",
      priority: "medium",
      estimatedCost: undefined,
    },
  });

  const selectedPropertyId = form.watch("propertyId");
  const { data: units = [] } = usePropertyUnits(
    selectedPropertyId,
    !!selectedPropertyId
  );

  const onSubmit = (data: MaintenanceFormData) => {
    createMutation.mutate(
      {
        ...data,
        unitId: data.unitId || undefined,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-slate-500" />
            Report Maintenance Issue
          </DialogTitle>
          <DialogDescription>
            Create a new maintenance request for a property issue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Property Selection */}
          <Controller
            control={form.control}
            name="propertyId"
            render={({ field, fieldState: { error } }) => (
              <Field>
                <FieldLabel>Property *</FieldLabel>
                <FieldContent>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(properties) ? properties : []).map(
                        (property: Property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FieldContent>
                <FieldError errors={[error]} />
              </Field>
            )}
          />

          {/* Unit Selection (optional) */}
          {selectedPropertyId && units.length > 0 && (
            <Controller
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Unit (Optional)</FieldLabel>
                  <FieldContent>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit: any) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              )}
            />
          )}

          {/* Title */}
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState: { error } }) => (
              <Field>
                <FieldLabel>Issue Title *</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="e.g. Leaking tap in bathroom"
                  />
                </FieldContent>
                <FieldError errors={[error]} />
              </Field>
            )}
          />

          {/* Description */}
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState: { error } }) => (
              <Field>
                <FieldLabel>Description *</FieldLabel>
                <FieldContent>
                  <Textarea
                    {...field}
                    placeholder="Describe the issue in detail..."
                    rows={3}
                  />
                </FieldContent>
                <FieldError errors={[error]} />
              </Field>
            )}
          />

          {/* Type and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <FieldContent>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(maintenanceTypeLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Priority</FieldLabel>
                  <FieldContent>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          {/* Estimated Cost (optional) */}
          <Controller
            control={form.control}
            name="estimatedCost"
            render={({ field }) => (
              <Field>
                <FieldLabel>Estimated Cost (Optional)</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0.00"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FieldContent>
              </Field>
            )}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
