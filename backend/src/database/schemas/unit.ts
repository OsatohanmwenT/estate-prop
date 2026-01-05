// unit.ts
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { leases } from "./lease";
import { properties } from "./property";

export const unitTypeEnum = pgEnum("unit_type", [
  "apartment",
  "studio",
  "penthouse",
  "duplex",
  "shop",
  "office",
  "warehouse",
  "townhouse",
]);

export const unitImages = pgTable("unit_images", {
  id: serial("id").primaryKey(),
  unitId: uuid("unit_id")
    .references(() => propertyUnits.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const unitStatus = pgEnum("unit_status", ["vacant", "occupied"]);
export const conditionStatus = pgEnum("condition_status", [
  "good",
  "fair",
  "poor",
  "renovation_needed",
]);

export const propertyUnits = pgTable(
  "property_units",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 50 }).notNull(), // e.g., "Flat 4B"
    description: text("description"),
    type: unitTypeEnum("type").notNull(),
    propertyId: uuid("property_id")
      .references(() => properties.id, { onDelete: "cascade" })
      .notNull(),
    amenities: text("amenities").array(),
    floor: integer("floor").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    unitSize: integer("unit_size").notNull(), // sqm
    status: unitStatus("status").default("vacant").notNull(),
        managementFeePercentage: decimal("management_fee_percentage", {
      precision: 5,
      scale: 2,
    }).default("0.00"), // e.g., 10.00 for 10%

    managementFeeFixed: decimal("management_fee_fixed", {
      precision: 12,
      scale: 2,
    }).default("0.00"), // e.g., 50,000 flat fee
    condition: conditionStatus("condition").default("good"),
    rentAmount: decimal("rent_amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_units_property_id").on(table.propertyId),
    index("idx_units_status").on(table.status),
    index("idx_units_property_status").on(table.propertyId, table.status),
    index("idx_units_created_at").on(table.createdAt),
    index("idx_units_property_code").on(table.propertyId, table.code),
  ]
);

// 5. Updated Relations
export const unitsRelations = relations(propertyUnits, ({ one, many }) => ({
  property: one(properties, {
    fields: [propertyUnits.propertyId],
    references: [properties.id],
  }),
  leases: many(leases),
  images: many(unitImages),
}));

export const unitImagesRelations = relations(unitImages, ({ one }) => ({
  unit: one(propertyUnits, {
    fields: [unitImages.unitId],
    references: [propertyUnits.id],
  }),
}));
