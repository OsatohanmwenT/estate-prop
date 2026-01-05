"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  Loader2,
  Phone,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { UpdateTenantFormData, updateTenantSchema } from "~/schemas/tenant";
import { Tenant, TenantDocument, TenantMetadata } from "~/types/tenant";

interface EditTenantFormProps {
  tenant: Tenant;
  onSubmit: (data: UpdateTenantFormData) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

const ID_TYPES = [
  { value: "national_id", label: "National ID" },
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "voters_card", label: "Voter's Card" },
  { value: "other", label: "Other" },
];

const TAB_ITEMS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "contact", label: "Contact & Emergency", icon: Phone },
  { id: "documents", label: "Documents", icon: FileText },
];

type FieldConfig = {
  name: keyof UpdateTenantFormData;
  label: string;
  type?: string;
  placeholder: string;
  component?: "input" | "textarea" | "select";
  rows?: number;
  options?: Array<{ value: string; label: string }>;
};

const PERSONAL_FIELDS: FieldConfig[] = [
  { name: "fullName", label: "Full Name *", placeholder: "John Doe" },
  {
    name: "email",
    label: "Email *",
    type: "email",
    placeholder: "john@example.com",
  },
  {
    name: "phone",
    label: "Phone *",
    type: "tel",
    placeholder: "+234 800 000 0000",
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    placeholder: "",
  },
  { name: "nationality", label: "Nationality", placeholder: "Nigerian" },
  {
    name: "currentAddress",
    label: "Current Address",
    placeholder: "123 Main Street, Lagos",
    component: "textarea",
    rows: 2,
  },
];

const EMPLOYMENT_FIELDS: FieldConfig[] = [
  { name: "occupation", label: "Occupation", placeholder: "Software Engineer" },
  {
    name: "annualIncome",
    label: "Annual Income",
    type: "number",
    placeholder: "5000000",
  },
  {
    name: "employerName",
    label: "Employer Name",
    placeholder: "ABC Company Ltd",
  },
  {
    name: "employerAddress",
    label: "Employer Address",
    placeholder: "456 Business Avenue, Victoria Island",
    component: "textarea",
    rows: 2,
  },
];

const EMERGENCY_FIELDS: FieldConfig[] = [
  { name: "nokName", label: "Next of Kin Name", placeholder: "Jane Doe" },
  {
    name: "nokPhone",
    label: "Next of Kin Phone",
    type: "tel",
    placeholder: "+234 800 000 0000",
  },
];

const GUARANTOR_FIELDS: FieldConfig[] = [
  {
    name: "guarantorName",
    label: "Guarantor Name",
    placeholder: "Robert Smith",
  },
  {
    name: "guarantorPhone",
    label: "Guarantor Phone",
    type: "tel",
    placeholder: "+234 800 000 0000",
  },
];

const ADDITIONAL_FIELDS: FieldConfig[] = [
  {
    name: "allottedParking",
    label: "Allotted Parking",
    placeholder: "Slot A-12",
  },
  { name: "accessCardNo", label: "Access Card No.", placeholder: "CARD-12345" },
  {
    name: "notes",
    label: "Notes",
    placeholder: "Any additional notes about the tenant...",
    component: "textarea",
    rows: 3,
  },
];

const ID_FIELDS: FieldConfig[] = [
  {
    name: "idType",
    label: "ID Type",
    placeholder: "Select ID type",
    component: "select",
    options: ID_TYPES,
  },
  { name: "idNumber", label: "ID Number", placeholder: "A12345678" },
];

export function EditTenantForm({
  tenant,
  onSubmit,
  onDelete,
  isLoading,
  isDeleting,
}: EditTenantFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [uploadedFiles, setUploadedFiles] = useState<TenantDocument[]>([]);

  const metadata: TenantMetadata = tenant.metadata
    ? JSON.parse(tenant.metadata)
    : {};

  const form = useForm<UpdateTenantFormData>({
    resolver: zodResolver(updateTenantSchema) as any,
    defaultValues: {
      fullName: tenant.fullName,
      email: tenant.email,
      phone: tenant.phone,
      dateOfBirth: metadata.dateOfBirth || "",
      nationality: metadata.nationality || "",
      occupation: metadata.occupation || "",
      employerName: metadata.employerName || "",
      employerAddress: metadata.employerAddress || "",
      annualIncome: tenant.annualIncome
        ? Number(tenant.annualIncome)
        : undefined,
      currentAddress: metadata.currentAddress || "",
      nokName: tenant.nokName || "",
      nokPhone: tenant.nokPhone || "",
      guarantorName: metadata.guarantorName || "",
      guarantorPhone: metadata.guarantorPhone || "",
      idType: metadata.idType || "",
      idNumber: metadata.idNumber || "",
      allottedParking: metadata.allottedParking || "",
      accessCardNo: metadata.accessCardNo || "",
      notes: metadata.notes || "",
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: TenantDocument[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: "other" as const,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <form
      id="edit-tenant-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col h-full bg-white font-sans text-slate-900"
    >
      <div className="flex-1 p-6 md:p-12 space-y-12">
        <FormSection
          title="Personal Information"
          description="Basic details about the tenant"
        >
          <FieldGrid
            fields={PERSONAL_FIELDS.slice(0, 1)}
            control={form.control}
          />
          <FieldGrid
            fields={PERSONAL_FIELDS.slice(1, 3)}
            columns={2}
            control={form.control}
          />
          <FieldGrid
            fields={PERSONAL_FIELDS.slice(3, 5)}
            columns={2}
            control={form.control}
          />
          <FieldGrid fields={PERSONAL_FIELDS.slice(5)} control={form.control} />
        </FormSection>

        <FormSection
          title="Employment Details"
          description="Work and income information"
        >
          <FieldGrid
            fields={EMPLOYMENT_FIELDS.slice(0, 2)}
            columns={2}
            control={form.control}
          />
          <FieldGrid
            fields={EMPLOYMENT_FIELDS.slice(2)}
            control={form.control}
          />
        </FormSection>

        <FormSection
          title="Emergency Contact"
          description="Next of kin or emergency contact details"
        >
          <FieldGrid
            fields={EMERGENCY_FIELDS}
            columns={2}
            control={form.control}
          />
        </FormSection>

        <FormSection
          title="Guarantor Information"
          description="Details of the tenant's guarantor"
        >
          <FieldGrid
            fields={GUARANTOR_FIELDS}
            columns={2}
            control={form.control}
          />
        </FormSection>

        <FormSection
          title="Additional Details"
          description="Other relevant information"
        >
          <FieldGrid
            fields={ADDITIONAL_FIELDS.slice(0, 2)}
            columns={2}
            control={form.control}
          />
          <FieldGrid
            fields={ADDITIONAL_FIELDS.slice(2)}
            control={form.control}
          />
        </FormSection>

        <FormSection
          title="Identification"
          description="Government-issued ID information"
        >
          <FieldGrid fields={ID_FIELDS} columns={2} control={form.control} />
        </FormSection>

        <DocumentUpload
          uploadedFiles={uploadedFiles}
          onUpload={handleFileUpload}
          onRemove={removeFile}
          uploadId="file-upload-edit"
        />
      </div>

      {/* Sticky Footer */}
      <div className="border-t border-slate-100 p-6 bg-white sticky bottom-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold uppercase tracking-wider"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Tenant
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-sm border-slate-200">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the tenant and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-sm border-slate-200">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-red-600 hover:bg-red-700 rounded-sm"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="rounded-sm border-slate-200 uppercase tracking-wider text-xs font-semibold px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-sm bg-slate-900 text-white hover:bg-slate-800 min-w-[140px] uppercase tracking-wider text-xs font-semibold px-6 shadow-none"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

// Reusable Components
function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-slate-900 pl-4">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      <div className="pl-4">
        <FieldGroup className="gap-5">{children}</FieldGroup>
      </div>
    </div>
  );
}

function FieldGrid({
  fields,
  columns = 1,
  control,
}: {
  fields: FieldConfig[];
  columns?: number;
  control: any;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5",
        columns === 2 && "md:grid-cols-2"
      )}
    >
      {fields.map((field) => (
        <FormField key={field.name} field={field} control={control} />
      ))}
    </div>
  );
}

function FormField({ field, control }: { field: FieldConfig; control: any }) {
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: formField, fieldState }) => (
        <Field className="gap-2" data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor={field.name}
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            {field.label}
          </FieldLabel>
          {field.component === "textarea" ? (
            <Textarea
              {...formField}
              id={field.name}
              placeholder={field.placeholder}
              rows={field.rows}
              className="resize-none rounded-sm border-slate-200 focus:border-slate-900"
            />
          ) : field.component === "select" ? (
            <Select onValueChange={formField.onChange} value={formField.value}>
              <SelectTrigger
                id={field.name}
                className="h-10 rounded-sm border-slate-200 focus:ring-0 focus:border-slate-900"
              >
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              {...formField}
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              className="h-10 rounded-sm border-slate-200 focus:border-slate-900"
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

function DocumentUpload({
  uploadedFiles,
  onUpload,
  onRemove,
  uploadId,
}: {
  uploadedFiles: TenantDocument[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  uploadId: string;
}) {
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-slate-900 pl-4">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          Upload Documents
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Upload tenant documents (ID copies, references, etc.)
        </p>
      </div>
      <div className="pl-4 space-y-4">
        <div
          className={cn(
            "border-2 border-dashed border-slate-200 rounded-sm p-8 text-center bg-slate-50/50",
            "hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer group"
          )}
          onClick={() => document.getElementById(uploadId)?.click()}
        >
          <div className="h-10 w-10 mx-auto bg-white rounded-full flex items-center justify-center border border-slate-200 mb-3 group-hover:scale-110 transition-transform">
            <Upload className="h-5 w-5 text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-900 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-500">PDF, JPG, PNG up to 10MB</p>
          <input
            id={uploadId}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={onUpload}
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Uploaded Files
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-sm shadow-sm group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 rounded-sm bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onRemove(file.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
