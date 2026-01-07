import { z } from "zod";
export declare const createUnitSchema: z.ZodObject<{
    code: z.ZodString;
    type: z.ZodEnum<{
        apartment: "apartment";
        studio: "studio";
        penthouse: "penthouse";
        duplex: "duplex";
        shop: "shop";
        office: "office";
        warehouse: "warehouse";
        townhouse: "townhouse";
    }>;
    rentAmount: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>;
    floor: z.ZodNumber;
    unitSize: z.ZodNumber;
    bedrooms: z.ZodNumber;
    bathrooms: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<{
        vacant: "vacant";
        occupied: "occupied";
    }>>;
    condition: z.ZodDefault<z.ZodEnum<{
        good: "good";
        fair: "fair";
        poor: "poor";
        renovation_needed: "renovation_needed";
    }>>;
    description: z.ZodOptional<z.ZodString>;
    amenities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    managementFeePercentage: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>;
    managementFeeFixed: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>;
}, z.core.$strip>;
export declare const updateUnitSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        apartment: "apartment";
        studio: "studio";
        penthouse: "penthouse";
        duplex: "duplex";
        shop: "shop";
        office: "office";
        warehouse: "warehouse";
        townhouse: "townhouse";
    }>>;
    rentAmount: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>;
    floor: z.ZodOptional<z.ZodNumber>;
    unitSize: z.ZodOptional<z.ZodNumber>;
    bedrooms: z.ZodOptional<z.ZodNumber>;
    bathrooms: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        vacant: "vacant";
        occupied: "occupied";
    }>>>;
    condition: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        good: "good";
        fair: "fair";
        poor: "poor";
        renovation_needed: "renovation_needed";
    }>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    amenities: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    managementFeePercentage: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>>;
    managementFeeFixed: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodTransform<string, string | number>>>>;
}, z.core.$strip>;
export type CreateUnitData = z.infer<typeof createUnitSchema>;
//# sourceMappingURL=unit.validation.d.ts.map