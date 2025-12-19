"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, Phone, Trash2, Upload, User, X } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
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
  { name: "email", label: "Email *", type: "email", placeholder: "john@example.com" },
  { name: "phone", label: "Phone *", type: "tel", placeholder: "+234 800 000 0000" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date", placeholder: "" },
  { name: "nationality", label: "Nationality", placeholder: "Nigerian" },
  { name: "currentAddress", label: "Current Address", placeholder: "123 Main Street, Lagos", component: "textarea", rows: 2 },
];

const EMPLOYMENT_FIELDS: FieldConfig[] = [
  { name: "occupation", label: "Occupation", placeholder: "Software Engineer" },
  { name: "annualIncome", label: "Annual Income", type: "number", placeholder: "5000000" },
  { name: "employerName", label: "Employer Name", placeholder: "ABC Company Ltd" },
  { name: "employerAddress", label: "Employer Address", placeholder: "456 Business Avenue, Victoria Island", component: "textarea", rows: 2 },
];

const EMERGENCY_FIELDS: FieldConfig[] = [
  { name: "nokName", label: "Next of Kin Name", placeholder: "Jane Doe" },
  { name: "nokPhone", label: "Next of Kin Phone", type: "tel", placeholder: "+234 800 000 0000" },
];

const GUARANTOR_FIELDS: FieldConfig[] = [
  { name: "guarantorName", label: "Guarantor Name", placeholder: "Robert Smith" },
  { name: "guarantorPhone", label: "Guarantor Phone", type: "tel", placeholder: "+234 800 000 0000" },
];

const ADDITIONAL_FIELDS: FieldConfig[] = [
  { name: "allottedParking", label: "Allotted Parking", placeholder: "Slot A-12" },
  { name: "accessCardNo", label: "Access Card No.", placeholder: "CARD-12345" },
  { name: "notes", label: "Notes", placeholder: "Any additional notes about the tenant...", component: "textarea", rows: 3 },
];

const ID_FIELDS: FieldConfig[] = [
  { name: "idType", label: "ID Type", placeholder: "Select ID type", component: "select", options: ID_TYPES },
  { name: "idNumber", label: "ID Number", placeholder: "A12345678" },
];

export function EditTenantForm({ tenant, onSubmit, onDelete, isLoading, isDeleting }: EditTenantFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [uploadedFiles, setUploadedFiles] = useState<TenantDocument[]>([]);

  const metadata: TenantMetadata = tenant.metadata ? JSON.parse(tenant.metadata) : {};

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
      annualIncome: tenant.annualIncome ? Number(tenant.annualIncome) : undefined,
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
    <form id="edit-tenant-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <FormSection title="Personal Information" description="Basic details about the tenant">
            <FieldGrid fields={PERSONAL_FIELDS.slice(0, 1)} control={form.control} />
            <FieldGrid fields={PERSONAL_FIELDS.slice(1, 3)} columns={2} control={form.control} />
            <FieldGrid fields={PERSONAL_FIELDS.slice(3, 5)} columns={2} control={form.control} />
            <FieldGrid fields={PERSONAL_FIELDS.slice(5)} control={form.control} />
          </FormSection>

          <FormSection title="Employment Details" description="Work and income information">
            <FieldGrid fields={EMPLOYMENT_FIELDS.slice(0, 2)} columns={2} control={form.control} />
            <FieldGrid fields={EMPLOYMENT_FIELDS.slice(2)} control={form.control} />
          </FormSection>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <FormSection title="Emergency Contact" description="Next of kin or emergency contact details">
            <FieldGrid fields={EMERGENCY_FIELDS} columns={2} control={form.control} />
          </FormSection>

          <FormSection title="Guarantor Information" description="Details of the tenant's guarantor">
            <FieldGrid fields={GUARANTOR_FIELDS} columns={2} control={form.control} />
          </FormSection>

          <FormSection title="Additional Details" description="Other relevant information">
            <FieldGrid fields={ADDITIONAL_FIELDS.slice(0, 2)} columns={2} control={form.control} />
            <FieldGrid fields={ADDITIONAL_FIELDS.slice(2)} control={form.control} />
          </FormSection>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <FormSection title="Identification" description="Government-issued ID information">
            <FieldGrid fields={ID_FIELDS} columns={2} control={form.control} />
          </FormSection>

          <DocumentUpload
            uploadedFiles={uploadedFiles}
            onUpload={handleFileUpload}
            onRemove={removeFile}
            uploadId="file-upload-edit"
          />
        </TabsContent>
      </Tabs>

      <FormActions
        onDelete={onDelete}
        isLoading={isLoading}
        isDeleting={isDeleting}
      />
    </form>
  );
}

// Reusable Components
function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4">{children}</FieldGroup>
      </CardContent>
    </Card>
  );
}

function FieldGrid({ fields, columns = 1, control }: { fields: FieldConfig[]; columns?: number; control: any }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4", columns === 2 && "md:grid-cols-2")}>
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
        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
          {field.component === "textarea" ? (
            <Textarea {...formField} id={field.name} placeholder={field.placeholder} rows={field.rows} />
          ) : field.component === "select" ? (
            <Select onValueChange={formField.onChange} value={formField.value}>
              <SelectTrigger id={field.name}>
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
            <Input {...formField} id={field.name} type={field.type} placeholder={field.placeholder} />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

function DocumentUpload({ uploadedFiles, onUpload, onRemove, uploadId }: {
  uploadedFiles: TenantDocument[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  uploadId: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>Upload tenant documents (ID copies, references, etc.)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center",
              "hover:border-primary/50 transition-colors cursor-pointer"
            )}
            onClick={() => document.getElementById(uploadId)?.click()}
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
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
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploaded Files</p>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onRemove(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FormActions({ onDelete, isLoading, isDeleting }: {
  onDelete?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}) {
  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div>
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete Tenant
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the tenant and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}