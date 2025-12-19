"use client";

import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "~/services";
import { unitService } from "~/services/unitService";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Property, Unit } from "~/types/property";
import { TenantFormData, tenantFormSchema } from "~/schemas/tenant";

interface TenantFormProps {
  initialData?: TenantFormData;
  onSubmit: (data: TenantFormData) => void;
  isLoading?: boolean;
}

export function TenantForm({
  initialData,
  onSubmit,
  isLoading,
}: TenantFormProps) {
  const form = useForm({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: initialData || {
      fullName: "",
      email: "",
      phone: "",
      occupation: "",
      emergencyNo: "",
      currentAddress: "",
      startDate: "",
      endDate: "",
      rentAmount: 0,
      paymentTerms: "monthly" as const,
      propertyId: "",
      unitId: "",
      depositAmount: 0,
      guarantorName: "",
      allottedParking: "",
      accessCardNo: "",
    },
  }) as UseFormReturn<TenantFormData>;

  const selectedPropertyId = form.watch("propertyId");

  // Fetch Properties
  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertyService.getAllProperties({ limit: 100 }),
  });

  // Fetch Units when property is selected
  const { data: units, isLoading: isLoadingUnits } = useQuery({
    queryKey: ["units", selectedPropertyId],
    queryFn: () => unitService.getUnitsByProperty(selectedPropertyId),
    enabled: !!selectedPropertyId && selectedPropertyId.length > 0,
  });

  // Reset unit if property changes
  useEffect(() => {
    if (selectedPropertyId && initialData?.propertyId !== selectedPropertyId) {
      form.setValue("unitId", "");
    }
  }, [selectedPropertyId, form, initialData]);

  const propertyList = Array.isArray(properties)
    ? properties
    : properties?.data || [];

  return (
    <form
      id="tenant-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-4">
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="gap-1.5"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="john@example.com"
                        type="email"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="gap-1.5"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                      <Input
                        {...field}
                        id="phone"
                        aria-invalid={fieldState.invalid}
                        placeholder="+1 234 567 890"
                        type="tel"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="occupation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Occupation</FieldLabel>
                    <Input
                      {...field}
                      id="occupation"
                      aria-invalid={fieldState.invalid}
                      placeholder="Software Engineer"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="currentAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Current Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="currentAddress"
                      aria-invalid={fieldState.invalid}
                      placeholder="123 Main St"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="emergencyNo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Emergency Contact No.
                    </FieldLabel>
                    <Input
                      {...field}
                      id="emergencyNo"
                      aria-invalid={fieldState.invalid}
                      placeholder="+1 987 654 321"
                      type="tel"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Lease Details */}
        <Card>
          <CardHeader>
            <CardTitle>Lease Agreement</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-4">
              <Controller
                name="propertyId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Property</FieldLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? field.value.toString() : ""}
                    >
                      <SelectTrigger id="propertyId">
                        <SelectValue placeholder="Select Property" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyList.map((prop: Property) => (
                          <SelectItem key={prop.id} value={prop.id.toString()}>
                            {prop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="unitId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Unit</FieldLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? field.value.toString() : ""}
                      disabled={!selectedPropertyId || isLoadingUnits}
                    >
                      <SelectTrigger id="unitId">
                        <SelectValue
                          placeholder={
                            isLoadingUnits ? "Loading..." : "Select Unit"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {units?.data?.map((unit: Unit) => (
                          <SelectItem key={unit.id} value={unit.id.toString()}>
                            {unit.name} ({unit.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="gap-1.5"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                      <Input
                        {...field}
                        id="startDate"
                        type="date"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="gap-1.5"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
                      <Input
                        {...field}
                        id="endDate"
                        type="date"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="rentAmount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="gap-1.5"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor={field.name}>Rent Amount</FieldLabel>
                      <Input
                        {...field}
                        id="rentAmount"
                        type="number"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="paymentTerms"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="gap-1.5"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor={field.name}>
                        Payment Terms
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="paymentTerms">
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="biannually">Biannually</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="depositAmount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Deposit Amount</FieldLabel>
                    <Input
                      {...field}
                      id="depositAmount"
                      type="number"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name="guarantorName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Guarantor Name</FieldLabel>
                    <Input
                      {...field}
                      id="guarantorName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Jane Doe"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="allottedParking"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Allotted Parking
                    </FieldLabel>
                    <Input
                      {...field}
                      id="allottedParking"
                      aria-invalid={fieldState.invalid}
                      placeholder="Slot 101"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="accessCardNo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Access Card No.
                    </FieldLabel>
                    <Input
                      {...field}
                      id="accessCardNo"
                      aria-invalid={fieldState.invalid}
                      placeholder="CARD-12345"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} form="tenant-form">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Tenant" : "Create Tenant"}
        </Button>
      </div>
    </form>
  );
}
