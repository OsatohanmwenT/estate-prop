import { z } from "zod";
export declare const createOwnerSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodEmail;
    phone: z.ZodString;
    address: z.ZodString;
    bankName: z.ZodOptional<z.ZodString>;
    accountNumber: z.ZodOptional<z.ZodString>;
    accountName: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    managedBy: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateOwnerSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    bankName: z.ZodOptional<z.ZodString>;
    accountNumber: z.ZodOptional<z.ZodString>;
    accountName: z.ZodOptional<z.ZodString>;
    managedBy: z.ZodNullable<z.ZodOptional<z.ZodUUID>>;
}, z.core.$strip>;
export type CreateOwnerInput = z.infer<typeof createOwnerSchema>;
export type UpdateOwnerInput = z.infer<typeof updateOwnerSchema>;
//# sourceMappingURL=owner.validation.d.ts.map