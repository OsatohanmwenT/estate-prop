"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyImagesRelations = exports.propertiesRelations = exports.properties = exports.propertyImages = exports.propertyCategory = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const unit_1 = require("./unit");
const user_1 = require("./user");
exports.propertyCategory = (0, pg_core_1.pgEnum)("property_category", [
    "residential",
    "commercial",
    "industrial",
    "mixed_use",
]);
exports.propertyImages = (0, pg_core_1.pgTable)("property_images", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    propertyId: (0, pg_core_1.uuid)("property_id")
        .references(() => exports.properties.id, { onDelete: "cascade" })
        .notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    caption: (0, pg_core_1.text)("caption"),
    isPrimary: (0, pg_core_1.boolean)("is_primary").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.properties = (0, pg_core_1.pgTable)("properties", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => user_1.organizations.id, { onDelete: "cascade" }),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    category: (0, exports.propertyCategory)("category").notNull(),
    amenities: (0, pg_core_1.text)("amenities").array(),
    address: (0, pg_core_1.text)("address").notNull(),
    lga: (0, pg_core_1.varchar)("lga", { length: 100 }),
    city: (0, pg_core_1.varchar)("city", { length: 100 }).notNull(),
    state: (0, pg_core_1.varchar)("state", { length: 100 }).notNull(),
    ownerId: (0, pg_core_1.uuid)("owner_id")
        .references(() => user_1.owners.id, { onDelete: "restrict" })
        .notNull(),
    description: (0, pg_core_1.text)("description"),
    totalUnits: (0, pg_core_1.integer)("total_units").default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_properties_org").on(table.organizationId),
    (0, pg_core_1.index)("idx_properties_name").on(table.name),
    (0, pg_core_1.index)("idx_properties_location").on(table.city, table.state),
    (0, pg_core_1.index)("idx_properties_owner_id").on(table.ownerId),
]);
exports.propertiesRelations = (0, drizzle_orm_1.relations)(exports.properties, ({ one, many }) => ({
    owner: one(user_1.owners, {
        fields: [exports.properties.ownerId],
        references: [user_1.owners.id],
    }),
    units: many(unit_1.propertyUnits),
    images: many(exports.propertyImages),
}));
exports.propertyImagesRelations = (0, drizzle_orm_1.relations)(exports.propertyImages, ({ one }) => ({
    property: one(exports.properties, {
        fields: [exports.propertyImages.propertyId],
        references: [exports.properties.id],
    }),
}));
//# sourceMappingURL=property.js.map