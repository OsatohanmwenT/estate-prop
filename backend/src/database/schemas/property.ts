import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { propertyUnits } from "./unit";
import { organizations, owners } from "./user";

export const propertyCategory = pgEnum("property_category", [
  "residential",
  "commercial",
  "industrial",
  "mixed_use",
]);

export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  isPrimary: boolean("is_primary").default(false), // To easily pick the thumbnail
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    category: propertyCategory("category").notNull(),
    amenities: text("amenities").array(),
    address: text("address").notNull(),
    lga: varchar("lga", { length: 100 }),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    ownerId: uuid("owner_id")
      .references(() => owners.id, { onDelete: "restrict" })
      .notNull(),
    description: text("description"),
    totalUnits: integer("total_units").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_properties_org").on(table.organizationId),
    index("idx_properties_name").on(table.name),
    index("idx_properties_location").on(table.city, table.state), // Composite index is better for location filtering
    index("idx_properties_owner_id").on(table.ownerId),
  ]
);

// 6. Updated: Relations
export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(owners, {
    fields: [properties.ownerId],
    references: [owners.id],
  }),
  units: many(propertyUnits),
  images: many(propertyImages),
}));

// Define relations for the new tables so queries work both ways
export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));
