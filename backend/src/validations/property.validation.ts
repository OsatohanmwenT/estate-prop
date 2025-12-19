import z from "zod";

export const createPropertySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(256, "Name must not exceed 256 characters")
    .trim(),
  address: z
    .string()
    .min(1, "Address is required")
    .max(512, "Address must not exceed 512 characters")
    .trim(),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must not exceed 100 characters")
    .trim(),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State must not exceed 100 characters")
    .trim(),
  category: z.enum(["residential", "commercial", "industrial", "mixed_use"], {
    message:
      "Category must be one of: residential, commercial, industrial, mixed_use",
  }),
  lga: z
    .string()
    .max(100, "LGA must not exceed 100 characters")
    .trim()
    .optional(),
  amenities: z.array(z.string()).optional(),
  ownerId: z.string().uuid("Owner ID must be a valid UUID").trim(),
  organizationId: z
    .string()
    .uuid("Organization ID must be a valid UUID")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),
  images: z.array(z.string().url("Each image must be a valid URL")).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();
