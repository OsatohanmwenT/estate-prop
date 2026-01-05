"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitImagesRelations = exports.unitsRelations = exports.propertyUnits = exports.conditionStatus = exports.unitStatus = exports.unitImages = exports.unitTypeEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const lease_1 = require("./lease");
const property_1 = require("./property");
exports.unitTypeEnum = (0, pg_core_1.pgEnum)("unit_type", [
    "apartment",
    "studio",
    "penthouse",
    "duplex",
    "shop",
    "office",
    "warehouse",
    "townhouse",
]);
exports.unitImages = (0, pg_core_1.pgTable)("unit_images", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    unitId: (0, pg_core_1.uuid)("unit_id")
        .references(() => exports.propertyUnits.id, { onDelete: "cascade" })
        .notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    caption: (0, pg_core_1.text)("caption"),
    isPrimary: (0, pg_core_1.boolean)("is_primary").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.unitStatus = (0, pg_core_1.pgEnum)("unit_status", ["vacant", "occupied"]);
exports.conditionStatus = (0, pg_core_1.pgEnum)("condition_status", [
    "good",
    "fair",
    "poor",
    "renovation_needed",
]);
exports.propertyUnits = (0, pg_core_1.pgTable)("property_units", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    type: (0, exports.unitTypeEnum)("type").notNull(),
    propertyId: (0, pg_core_1.uuid)("property_id")
        .references(() => property_1.properties.id, { onDelete: "cascade" })
        .notNull(),
    amenities: (0, pg_core_1.text)("amenities").array(),
    floor: (0, pg_core_1.integer)("floor").notNull(),
    bedrooms: (0, pg_core_1.integer)("bedrooms").notNull(),
    bathrooms: (0, pg_core_1.integer)("bathrooms").notNull(),
    unitSize: (0, pg_core_1.integer)("unit_size").notNull(),
    status: (0, exports.unitStatus)("status").default("vacant").notNull(),
    managementFeePercentage: (0, pg_core_1.decimal)("management_fee_percentage", {
        precision: 5,
        scale: 2,
    }).default("0.00"),
    managementFeeFixed: (0, pg_core_1.decimal)("management_fee_fixed", {
        precision: 12,
        scale: 2,
    }).default("0.00"),
    condition: (0, exports.conditionStatus)("condition").default("good"),
    rentAmount: (0, pg_core_1.decimal)("rent_amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_units_property_id").on(table.propertyId),
    (0, pg_core_1.index)("idx_units_status").on(table.status),
    (0, pg_core_1.index)("idx_units_property_status").on(table.propertyId, table.status),
    (0, pg_core_1.index)("idx_units_created_at").on(table.createdAt),
    (0, pg_core_1.index)("idx_units_property_code").on(table.propertyId, table.code),
]);
exports.unitsRelations = (0, drizzle_orm_1.relations)(exports.propertyUnits, ({ one, many }) => ({
    property: one(property_1.properties, {
        fields: [exports.propertyUnits.propertyId],
        references: [property_1.properties.id],
    }),
    leases: many(lease_1.leases),
    images: many(exports.unitImages),
}));
exports.unitImagesRelations = (0, drizzle_orm_1.relations)(exports.unitImages, ({ one }) => ({
    unit: one(exports.propertyUnits, {
        fields: [exports.unitImages.unitId],
        references: [exports.propertyUnits.id],
    }),
}));
//# sourceMappingURL=unit.js.map