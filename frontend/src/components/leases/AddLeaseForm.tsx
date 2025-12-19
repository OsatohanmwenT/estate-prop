"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Loader2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DatePicker } from "~/components/ui/date-picker";
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
import { Textarea } from "~/components/ui/textarea";
import { useProperties, usePropertyUnits } from "~/lib/query/index";
import { useTenants } from "~/lib/query/tenants";
import {
  BILLING_CYCLES,
  calculateLeaseDuration,
  CreateLeaseFormData,
  createLeaseSchema,
  getSuggestedEndDate,
} from "~/schemas/lease";

interface AddLeaseFormProps {
  initialData?: Partial<CreateLeaseFormData>;
  onSubmit: (data: CreateLeaseFormData) => void;
  isLoading?: boolean;
  defaultPropertyId?: string;
  defaultUnitId?: string;
  defaultTenantId?: string;
  isEditMode?: boolean;
}

// Styling constants for consistency
const FIELD_STYLES = {
  label: "text-xs font-bold uppercase tracking-wider text-slate-500",
  input: "rounded-sm border-slate-200 bg-white",
};

const CARD_STYLES = {
  card: "rounded-sm border-slate-200 !pt-0 shadow-sm",
  header: "border-b border-slate-100 pt-4 bg-slate-50",
  title: "text-sm font-bold uppercase tracking-widest text-slate-900",
  description: "text-xs text-slate-500",
  content: "p-6",
};

// Field configuration types
type FieldConfig = {
  name: keyof CreateLeaseFormData;
  label: string;
  type?: string;
  placeholder: string;
  component?: "input" | "textarea" | "select";
  rows?: number;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  readOnly?: boolean;
};

// Field configurations
const LEASE_PERIOD_FIELDS: FieldConfig[] = [
  {
    name: "startDate",
    label: "Start Date *",
    type: "date",
    placeholder: "",
  },
  {
    name: "endDate",
    label: "End Date *",
    type: "date",
    placeholder: "",
  },
];

const FINANCIAL_FIELDS: FieldConfig[] = [
  {
    name: "rentAmount",
    label: "Rent Amount *",
    type: "number",
    placeholder: "5000000",
  },
  {
    name: "billingCycle",
    label: "Billing Cycle *",
    placeholder: "Select billing cycle",
    component: "select",
    options: BILLING_CYCLES as unknown as Array<{
      value: string;
      label: string;
    }>,
  },
];

const FEES_FIELDS: FieldConfig[] = [
  {
    name: "cautionDeposit",
    label: "Caution Deposit",
    type: "number",
    placeholder: "0",
  },
  {
    name: "agencyFee",
    label: "Agency Fee",
    type: "number",
    placeholder: "0",
  },
  {
    name: "legalFee",
    label: "Legal Fee",
    type: "number",
    placeholder: "0",
  },
];

const DOCUMENT_FIELDS: FieldConfig[] = [
  {
    name: "agreementUrl",
    label: "Agreement URL",
    type: "url",
    placeholder: "https://...",
  },
  {
    name: "notes",
    label: "Notes",
    placeholder: "Any additional notes about the lease...",
    component: "textarea",
    rows: 3,
  },
];

export function AddLeaseForm({
  initialData,
  onSubmit: onFormSubmit,
  isLoading,
  defaultPropertyId,
  defaultUnitId,
  defaultTenantId,
  isEditMode = false,
}: AddLeaseFormProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    initialData?.propertyId || defaultPropertyId || ""
  );

  // Fetch data
  const { data: propertiesData, isLoading: loadingProperties } =
    useProperties();
  const properties = Array.isArray(propertiesData)
    ? propertiesData
    : (propertiesData as any)?.properties || [];

  const { data: units = [], isLoading: loadingUnits } = usePropertyUnits(
    selectedPropertyId,
    !!selectedPropertyId
  );
  const { data: tenantsData, isLoading: loadingTenants } = useTenants();
  const tenants = tenantsData || [];

  // Filter available units (vacant only) - but include the pre-selected unit if it exists
  const preSelectedUnitId = initialData?.unitId || defaultUnitId;
  const availableUnits = units.filter(
    (unit: any) => unit.status === "vacant" || unit.id === preSelectedUnitId
  );

  const form = useForm<CreateLeaseFormData>({
    resolver: zodResolver(createLeaseSchema) as any,
    defaultValues: {
      propertyId: defaultPropertyId || "",
      unitId: defaultUnitId || "",
      tenantId: defaultTenantId || "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      rentAmount: 0,
      billingCycle: "annually",
      cautionDeposit: 0,
      agencyFee: 0,
      legalFee: 0,
      agreementUrl: "",
      notes: "",
      ...initialData,
    },
  });

  const watchedBillingCycle = form.watch("billingCycle");
  const watchedStartDate = form.watch("startDate");
  const watchedEndDate = form.watch("endDate");
  const watchedUnitId = form.watch("unitId");
  const watchedRentAmount = Number(form.watch("rentAmount")) || 0;
  const watchedDeposit = Number(form.watch("cautionDeposit")) || 0;
  const watchedAgencyFee = Number(form.watch("agencyFee")) || 0;
  const watchedLegalFee = Number(form.watch("legalFee")) || 0;

  // Auto-suggest end date when start date or billing cycle changes
  useEffect(() => {
    if (watchedStartDate && watchedBillingCycle && !watchedEndDate) {
      const suggestedEnd = getSuggestedEndDate(
        watchedStartDate,
        watchedBillingCycle
      );
      form.setValue("endDate", suggestedEnd);
    }
  }, [watchedStartDate, watchedBillingCycle]);

  // Auto-fill rent amount when unit is selected
  useEffect(() => {
    if (watchedUnitId) {
      const selectedUnit = units.find((u: any) => u.id === watchedUnitId);
      if (selectedUnit?.rentAmount) {
        form.setValue("rentAmount", parseFloat(selectedUnit.rentAmount));
      }
    }
  }, [watchedUnitId, units]);

  // Calculate totals
  const leaseDuration =
    watchedStartDate && watchedEndDate
      ? calculateLeaseDuration(watchedStartDate, watchedEndDate)
      : 0;
  const totalAmount =
    watchedRentAmount + watchedDeposit + watchedAgencyFee + watchedLegalFee;

  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    form.setValue("propertyId", propertyId);
    form.setValue("unitId", ""); // Reset unit when property changes
  };

  return (
    <form
      onSubmit={form.handleSubmit(onFormSubmit)}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Property & Unit Selection */}
      <FormSection
        title="Property & Unit Selection"
        description="Select the property and unit for this lease"
        icon={Building2}
      >
        <FieldGroup className="gap-6">
          {/* Property Selection */}
          <Controller
            name="propertyId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="propertyId" className={FIELD_STYLES.label}>
                  Property *
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={handlePropertyChange}
                  disabled={loadingProperties}
                >
                  <SelectTrigger id="propertyId" className={FIELD_STYLES.input}>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm border-slate-200">
                    {properties.map((property: any) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
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

          {/* Unit Selection */}
          <Controller
            name="unitId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="unitId" className={FIELD_STYLES.label}>
                  Unit *
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedPropertyId || loadingUnits}
                >
                  <SelectTrigger id="unitId" className={FIELD_STYLES.input}>
                    <SelectValue
                      placeholder={
                        !selectedPropertyId
                          ? "Select a property first"
                          : loadingUnits
                            ? "Loading units..."
                            : "Select a unit"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm border-slate-200">
                    {availableUnits.map((unit: any) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.code} - {unit.type}
                        {unit.rentAmount &&
                          ` (₦${parseFloat(unit.rentAmount).toLocaleString()})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                {availableUnits.length === 0 &&
                  selectedPropertyId &&
                  !loadingUnits && (
                    <p className="text-xs text-amber-600">
                      No vacant units available in this property
                    </p>
                  )}
              </Field>
            )}
          />
        </FieldGroup>
      </FormSection>

      {/* Tenant Selection */}
      <FormSection
        title="Tenant Selection"
        description="Select the tenant for this lease"
        icon={User}
      >
        <Controller
          name="tenantId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="gap-2" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tenantId" className={FIELD_STYLES.label}>
                Tenant *
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={loadingTenants}
              >
                <SelectTrigger id="tenantId" className={FIELD_STYLES.input}>
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-slate-200">
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.fullName} ({tenant.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FormSection>

      {/* Lease Period */}
      <FormSection
        title="Lease Period"
        description="Define the lease start and end dates"
        icon={Calendar}
      >
        <FieldGroup className="gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldGrid fields={LEASE_PERIOD_FIELDS} control={form.control} />
          </div>
          {leaseDuration > 0 && (
            <div className="rounded-sm border border-emerald-200 bg-emerald-50/50 p-3">
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-1">
                Lease Duration
              </p>
              <p className="text-sm text-emerald-700">
                {leaseDuration} {leaseDuration === 1 ? "month" : "months"}
              </p>
            </div>
          )}
        </FieldGroup>
      </FormSection>

      {/* Financial Details */}
      <FormSection
        title="Financial Details"
        description="Define rent amount and billing frequency"
        icon={CreditCard}
      >
        <FieldGroup className="gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldGrid fields={FINANCIAL_FIELDS} control={form.control} />
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Additional Fees
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FieldGrid fields={FEES_FIELDS} control={form.control} />
            </div>
          </div>

          {/* Total Amount Summary */}
          {totalAmount > 0 && (
            <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Rent Amount:</span>
                  <span className="font-medium">
                    ₦{watchedRentAmount.toLocaleString()}
                  </span>
                </div>
                {watchedDeposit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Caution Deposit:</span>
                    <span className="font-medium">
                      ₦{watchedDeposit.toLocaleString()}
                    </span>
                  </div>
                )}
                {watchedAgencyFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Agency Fee:</span>
                    <span className="font-medium">
                      ₦{watchedAgencyFee.toLocaleString()}
                    </span>
                  </div>
                )}
                {watchedLegalFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Legal Fee:</span>
                    <span className="font-medium">
                      ₦{watchedLegalFee.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-300 flex justify-between text-base font-bold">
                  <span className="text-slate-900">Total Amount:</span>
                  <span className="text-emerald-600">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </FieldGroup>
      </FormSection>

      {/* Documents & Notes */}
      <FormSection
        title="Documents & Notes"
        description="Add agreement URL and additional notes"
        icon={FileText}
      >
        <FieldGroup className="gap-6">
          <FieldGrid fields={DOCUMENT_FIELDS} control={form.control} />
        </FieldGroup>
      </FormSection>

      {/* Form Actions */}
      <FormActions
        isLoading={isLoading}
        isUpdate={isEditMode || !!initialData}
      />
    </form>
  );
}

// Reusable Components
function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <Card className={CARD_STYLES.card}>
      <CardHeader className={CARD_STYLES.header}>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-400" />
          <CardTitle className={CARD_STYLES.title}>{title}</CardTitle>
        </div>
        <CardDescription className={CARD_STYLES.description}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className={CARD_STYLES.content}>{children}</CardContent>
    </Card>
  );
}

function FieldGrid({
  fields,
  control,
}: {
  fields: FieldConfig[];
  control: any;
}) {
  return (
    <>
      {fields.map((field) => (
        <FormField key={field.name} field={field} control={control} />
      ))}
    </>
  );
}

function FormField({ field, control }: { field: FieldConfig; control: any }) {
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: formField, fieldState }) => (
        <Field className="gap-2" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name} className={FIELD_STYLES.label}>
            {field.label}
          </FieldLabel>
          {field.component === "textarea" ? (
            <Textarea
              {...formField}
              id={field.name}
              placeholder={field.placeholder}
              rows={field.rows}
              className={FIELD_STYLES.input}
              disabled={field.disabled}
              readOnly={field.readOnly}
            />
          ) : field.component === "select" ? (
            <Select
              onValueChange={formField.onChange}
              value={formField.value}
              disabled={field.disabled}
            >
              <SelectTrigger id={field.name} className={FIELD_STYLES.input}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-slate-200">
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === "date" ? (
            <DatePicker
              date={formField.value}
              onSelect={(date) => {
                const formattedDate = date
                  ? date.toISOString().split("T")[0]
                  : "";
                formField.onChange(formattedDate);
              }}
              placeholder={field.placeholder || "Select date"}
              disabled={field.disabled}
              className={FIELD_STYLES.input}
            />
          ) : (
            <Input
              {...formField}
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              className={FIELD_STYLES.input}
              disabled={field.disabled}
              readOnly={field.readOnly}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

function FormActions({
  isLoading,
  isUpdate,
}: {
  isLoading?: boolean;
  isUpdate: boolean;
}) {
  return (
    <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-200">
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-sm border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 uppercase text-xs font-bold tracking-wider"
        onClick={() => window.history.back()}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-9 rounded-sm bg-emerald-600 text-white hover:bg-emerald-700 uppercase text-xs font-bold tracking-wider border-0"
      >
        {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
        {isUpdate ? "Update Lease" : "Create Lease"}
      </Button>
    </div>
  );
}
