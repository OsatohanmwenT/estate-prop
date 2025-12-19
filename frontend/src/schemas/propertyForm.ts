import { z } from "zod";

export const PropertySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter a property name")
    .max(256, "Property name must not exceed 256 characters"),
  address: z
    .string()
    .trim()
    .min(1, "Please complete the address fields")
    .max(512, "Address must not exceed 512 characters"),
  city: z
    .string()
    .trim()
    .min(1, "Please complete the address fields")
    .max(100, "City name must not exceed 100 characters"),
  state: z
    .string()
    .trim()
    .min(1, "Please complete the address fields")
    .max(100, "State name must not exceed 100 characters"),
  lga: z
    .string()
    .trim()
    .max(100, "LGA must not exceed 100 characters")
    .optional(),
  category: z.enum(["residential", "commercial", "industrial", "mixed_use"], {
    message: "Please select a property category",
  }),
  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),
  ownerId: z.uuid("Please select a property owner"),
  organizationId: z
    .string("Organization ID is missing. Please log in again."),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export type PropertySchemaInput = z.infer<typeof PropertySchema>;
