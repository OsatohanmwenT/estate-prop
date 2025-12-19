import { z } from "zod";

// Schema for tenant personal info only (without lease)
export const tenantPersonalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  occupation: z.string().optional(),
  employerName: z.string().optional(),
  employerAddress: z.string().optional(),
  annualIncome: z.coerce.number().optional(),
  currentAddress: z.string().optional(),
});

// Schema for contact/emergency info
export const tenantContactSchema = z.object({
  nokName: z.string().optional(),
  nokPhone: z.string().optional(),
  guarantorName: z.string().optional(),
  guarantorPhone: z.string().optional(),
});

// Schema for identification documents
export const tenantDocumentsSchema = z.object({
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  documents: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(["id", "lease", "receipt", "reference", "other"]),
        url: z.string(),
      })
    )
    .optional(),
});

// Schema for additional tenant info
export const tenantAdditionalSchema = z.object({
  allottedParking: z.string().optional(),
  accessCardNo: z.string().optional(),
  notes: z.string().optional(),
});

// Combined schema for creating a tenant (without lease)
export const createTenantSchema = tenantPersonalInfoSchema
  .merge(tenantContactSchema)
  .merge(tenantDocumentsSchema)
  .merge(tenantAdditionalSchema);

export type CreateTenantFormData = z.infer<typeof createTenantSchema>;

// Schema for updating a tenant
export const updateTenantSchema = createTenantSchema.partial();

export type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;

// Original full schema for tenant with lease (for backwards compatibility)
export const tenantFormSchema = z.object({
  // Personal Details
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  occupation: z.string().optional(),
  emergencyNo: z.string().optional(),
  currentAddress: z.string().optional(),

  // Lease Details
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  rentAmount: z.coerce.number().min(0, "Rent amount must be positive"),
  paymentTerms: z.enum(["monthly", "quarterly", "biannually", "annually"]),
  propertyId: z.string().min(1, "Property is required"),
  unitId: z.string().min(1, "Unit is required"),
  depositAmount: z.coerce.number().min(0, "Deposit amount must be positive"),

  // Additional Details
  guarantorName: z.string().optional(),
  allottedParking: z.string().optional(),
  accessCardNo: z.string().optional(),

  // Documents (Placeholder for now)
  documentUrl: z.string().optional(),
});

export type TenantFormData = z.infer<typeof tenantFormSchema>;
