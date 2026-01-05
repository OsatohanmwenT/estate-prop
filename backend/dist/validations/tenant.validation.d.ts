import { z } from "zod";
export declare const createTenantSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodEmail;
    phone: z.ZodString;
    nokName: z.ZodOptional<z.ZodString>;
    nokPhone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTenantSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    phone: z.ZodOptional<z.ZodString>;
    nokName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    nokPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateTenantData = z.infer<typeof createTenantSchema>;
export type UpdateTenantData = z.infer<typeof updateTenantSchema>;
//# sourceMappingURL=tenant.validation.d.ts.map