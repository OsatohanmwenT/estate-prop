"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, Phone, Upload, User, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { CreateTenantFormData, createTenantSchema } from "~/schemas/tenant";

interface AddTenantFormProps {
  initialData?: Partial<CreateTenantFormData>;
  onSubmit: (data: CreateTenantFormData) => void;
  isLoading?: boolean;
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

// Reusable field configuration type
type FieldConfig = {
  name: keyof CreateTenantFormData;
  label: string;
  type?: string;
  placeholder: string;
  component?: "input" | "textarea" | "select";
  rows?: number;
  options?: Array<{ value: string; label: string }>;
};

// Field configurations
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

export function AddTenantForm({ initialData, onSubmit, isLoading }: AddTenantFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; type: "id" | "lease" | "receipt" | "reference" | "other"; url: string }>
  >([]);

  const form = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema) as any,
    defaultValues: {
      fullName: "", email: "", phone: "", dateOfBirth: "", nationality: "",
      occupation: "", employerName: "", employerAddress: "", annualIncome: undefined,
      currentAddress: "", nokName: "", nokPhone: "", guarantorName: "", guarantorPhone: "",
      idType: "", idNumber: "", allottedParking: "", accessCardNo: "", notes: "",
      ...initialData,
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        type: "other" as const,
        url: URL.createObjectURL(file),
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: CreateTenantFormData) => {
    onSubmit({ ...data, documents: uploadedFiles });
  };

  const navigateTab = (direction: "next" | "prev") => {
    const currentIndex = TAB_ITEMS.findIndex((t) => t.id === activeTab);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < TAB_ITEMS.length) {
      setActiveTab(TAB_ITEMS[newIndex].id);
    }
  };

  return (
    <form id="add-tenant-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-50/50 p-1 h-10 gap-1 justify-start border border-slate-100 rounded-md w-fit mb-6">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 rounded-sm px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <tab.icon className="h-3.5 w-3.5" />
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
          />
        </TabsContent>

        <FormNavigation
          activeTab={activeTab}
          onNavigate={navigateTab}
          isLoading={isLoading}
          isUpdate={!!initialData}
        />
      </Tabs>
    </form>
  );
}

// Reusable Components
function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className={CARD_STYLES.card}>
      <CardHeader className={CARD_STYLES.header}>
        <CardTitle className={CARD_STYLES.title}>{title}</CardTitle>
        <CardDescription className={CARD_STYLES.description}>{description}</CardDescription>
      </CardHeader>
      <CardContent className={CARD_STYLES.content}>
        <FieldGroup className="gap-6">{children}</FieldGroup>
      </CardContent>
    </Card>
  );
}

function FieldGrid({ fields, columns = 1, control }: { fields: FieldConfig[]; columns?: number; control: any }) {
  return (
    <div className={cn("grid grid-cols-1 gap-6", columns === 2 && "md:grid-cols-2")}>
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
          <FieldLabel htmlFor={field.name} className={FIELD_STYLES.label}>
            {field.label}
          </FieldLabel>
          {field.component === "textarea" ? (
            <Textarea {...formField} id={field.name} placeholder={field.placeholder} rows={field.rows} className={FIELD_STYLES.input} />
          ) : field.component === "select" ? (
            <Select onValueChange={formField.onChange} value={formField.value}>
              <SelectTrigger id={field.name} className={FIELD_STYLES.input}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-slate-200">
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input {...formField} id={field.name} type={field.type} placeholder={field.placeholder} className={FIELD_STYLES.input} />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

function DocumentUpload({ uploadedFiles, onUpload, onRemove }: any) {
  return (
    <Card className={CARD_STYLES.card}>
      <CardHeader className={CARD_STYLES.header}>
        <CardTitle className={CARD_STYLES.title}>Upload Documents</CardTitle>
        <CardDescription className={CARD_STYLES.description}>
          Upload tenant documents (ID copies, references, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className={CARD_STYLES.content}>
        <div className="space-y-4">
          <div
            className={cn(
              "border border-dashed border-slate-200 rounded-sm p-8 text-center bg-slate-50/50",
              "hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            )}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="h-10 w-10 mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
            <p className="text-sm text-slate-600 font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</p>
            <input id="file-upload" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onUpload} />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Uploaded Files</p>
              <div className="space-y-2">
                {uploadedFiles.map((file: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-sm shadow-sm">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-600"
                      onClick={() => onRemove(index)}
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

function FormNavigation({ activeTab, onNavigate, isLoading, isUpdate }: any) {
  const isFirstTab = activeTab === "personal";
  const isLastTab = activeTab === "documents";

  return (
    <div className="flex justify-between items-center pt-8 border-t border-slate-200">
      <div className="flex gap-2">
        {!isFirstTab && (
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-sm border-slate-200 text-slate-600 uppercase text-xs font-bold tracking-wider"
            onClick={() => onNavigate("prev")}
          >
            Previous
          </Button>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-sm border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 uppercase text-xs font-bold tracking-wider"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>

        {!isLastTab ? (
          <Button
            type="button"
            className="h-9 rounded-sm bg-slate-900 text-white hover:bg-slate-800 uppercase text-xs font-bold tracking-wider"
            onClick={(e) => {
                e.preventDefault();
                onNavigate("next")
            }}
          >
            Next Step
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isLoading}
            className="h-9 rounded-sm bg-emerald-600 text-white hover:bg-emerald-700 uppercase text-xs font-bold tracking-wider border-0"
          >
            {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            {isUpdate ? "Update Tenant" : "Create Tenant"}
          </Button>
        )}
      </div>
    </div>
  );
}