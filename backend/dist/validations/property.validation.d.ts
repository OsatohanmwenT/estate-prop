import z from "zod";
export declare const createPropertySchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    category: z.ZodEnum<{
        residential: "residential";
        commercial: "commercial";
        industrial: "industrial";
        mixed_use: "mixed_use";
    }>;
    lga: z.ZodOptional<z.ZodString>;
    amenities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    ownerId: z.ZodString;
    organizationId: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const updatePropertySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        residential: "residential";
        commercial: "commercial";
        industrial: "industrial";
        mixed_use: "mixed_use";
    }>>;
    lga: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    amenities: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    ownerId: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
//# sourceMappingURL=property.validation.d.ts.map