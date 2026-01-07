import { z } from "zod";
export declare const createLeaseSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
    rentAmount: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>;
    tenantId: z.ZodString;
    unitId: z.ZodString;
    billingCycle: z.ZodEnum<{
        monthly: "monthly";
        quarterly: "quarterly";
        biannually: "biannually";
        annually: "annually";
    }>;
    cautionDeposit: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>;
    agencyFee: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>;
    legalFee: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>;
    notes: z.ZodOptional<z.ZodString>;
    agreementUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateLeaseSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    rentAmount: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>;
    tenantId: z.ZodOptional<z.ZodString>;
    unitId: z.ZodOptional<z.ZodString>;
    billingCycle: z.ZodOptional<z.ZodEnum<{
        monthly: "monthly";
        quarterly: "quarterly";
        biannually: "biannually";
        annually: "annually";
    }>>;
    cautionDeposit: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>>;
    agencyFee: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>>;
    legalFee: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    agreementUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=lease.validation.d.ts.map