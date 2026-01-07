"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsRelations = exports.foldersRelations = exports.documents = exports.folders = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const _1 = require(".");
const user_1 = require("./user");
exports.folders = (0, pg_core_1.pgTable)("folders", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => user_1.organizations.id, { onDelete: "cascade" }),
    name: (0, pg_core_1.text)("name").notNull(),
    propertyId: (0, pg_core_1.uuid)("property_id").references(() => _1.properties.id, {
        onDelete: "cascade",
    }),
    parentFolderId: (0, pg_core_1.uuid)("parent_folder_id"),
    createdBy: (0, pg_core_1.uuid)("created_by").references(() => user_1.users.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_folders_org").on(table.organizationId),
    (0, pg_core_1.index)("idx_folders_parent").on(table.parentFolderId),
    (0, pg_core_1.index)("idx_folders_property").on(table.propertyId),
    (0, pg_core_1.foreignKey)({
        columns: [table.parentFolderId],
        foreignColumns: [table.id],
    }).onDelete("cascade"),
]);
exports.documents = (0, pg_core_1.pgTable)("documents", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    organizationId: (0, pg_core_1.uuid)("organization_id")
        .notNull()
        .references(() => user_1.organizations.id, { onDelete: "cascade" }),
    folderId: (0, pg_core_1.uuid)("folder_id").references(() => exports.folders.id, {
        onDelete: "cascade",
    }),
    propertyId: (0, pg_core_1.uuid)("property_id").references(() => _1.properties.id, {
        onDelete: "cascade",
    }),
    ownerId: (0, pg_core_1.uuid)("owner_id").references(() => user_1.owners.id, {
        onDelete: "cascade",
    }),
    fileName: (0, pg_core_1.text)("file_name").notNull(),
    fileUrl: (0, pg_core_1.text)("file_url").notNull(),
    fileType: (0, pg_core_1.text)("file_type").notNull(),
    fileSize: (0, pg_core_1.integer)("file_size"),
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.text)("category").notNull(),
    tags: (0, pg_core_1.text)("tags").array(),
    uploadedBy: (0, pg_core_1.uuid)("uploaded_by").references(() => user_1.users.id, {
        onDelete: "set null",
    }),
    uploadedAt: (0, pg_core_1.timestamp)("uploaded_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("idx_documents_org").on(table.organizationId),
    (0, pg_core_1.index)("idx_documents_folder").on(table.folderId),
    (0, pg_core_1.index)("idx_documents_property").on(table.propertyId),
    (0, pg_core_1.index)("idx_documents_owner").on(table.ownerId),
    (0, pg_core_1.index)("idx_documents_category").on(table.category),
]);
exports.foldersRelations = (0, drizzle_orm_1.relations)(exports.folders, ({ one, many }) => ({
    organization: one(user_1.organizations, {
        fields: [exports.folders.organizationId],
        references: [user_1.organizations.id],
    }),
    parentFolder: one(exports.folders, {
        fields: [exports.folders.parentFolderId],
        references: [exports.folders.id],
    }),
    subfolders: many(exports.folders),
    documents: many(exports.documents),
}));
exports.documentsRelations = (0, drizzle_orm_1.relations)(exports.documents, ({ one }) => ({
    organization: one(user_1.organizations, {
        fields: [exports.documents.organizationId],
        references: [user_1.organizations.id],
    }),
    folder: one(exports.folders, {
        fields: [exports.documents.folderId],
        references: [exports.folders.id],
    }),
    uploadedBy: one(user_1.users, {
        fields: [exports.documents.uploadedBy],
        references: [user_1.users.id],
    }),
}));
//# sourceMappingURL=document.js.map