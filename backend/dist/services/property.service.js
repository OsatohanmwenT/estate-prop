"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
class PropertyService {
    async getAllProperties(options) {
        const { search, city, state, category, ownerId, organizationId, limit = 15, offset = 0, } = options || {};
        const conditions = [];
        if (organizationId) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.properties.organizationId, organizationId));
        }
        if (search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schemas_1.properties.name, `%${search}%`), (0, drizzle_orm_1.ilike)(schemas_1.properties.address, `%${search}%`), (0, drizzle_orm_1.ilike)(schemas_1.properties.city, `%${search}%`)));
        }
        if (city) {
            conditions.push((0, drizzle_orm_1.ilike)(schemas_1.properties.city, `%${city}%`));
        }
        if (state) {
            conditions.push((0, drizzle_orm_1.ilike)(schemas_1.properties.state, `%${state}%`));
        }
        if (category) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.properties.category, category));
        }
        if (ownerId) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.properties.ownerId, ownerId));
        }
        const query = database_1.db
            .select({
            id: schemas_1.properties.id,
            name: schemas_1.properties.name,
            address: schemas_1.properties.address,
            category: schemas_1.properties.category,
            city: schemas_1.properties.city,
            state: schemas_1.properties.state,
            totalUnits: schemas_1.properties.totalUnits,
            unitCount: (0, drizzle_orm_1.sql) `(
          SELECT COUNT(*)::int 
          FROM property_units 
          WHERE property_units.property_id = properties.id
        )`,
            occupiedUnits: (0, drizzle_orm_1.sql) `(
          SELECT COUNT(*)::int 
          FROM property_units 
          WHERE property_units.property_id = properties.id
          AND property_units.status = 'occupied'
        )`,
            vacantUnits: (0, drizzle_orm_1.sql) `(
          SELECT COUNT(*)::int 
          FROM property_units 
          WHERE property_units.property_id = properties.id
          AND property_units.status = 'vacant'
        )`,
            totalRevenue: (0, drizzle_orm_1.sql) `(
          SELECT COALESCE(SUM(invoices.amount_paid), 0)::text
          FROM invoices
          INNER JOIN leases ON invoices.lease_id = leases.id
          INNER JOIN property_units ON leases.unit_id = property_units.id
          WHERE property_units.property_id = properties.id
        )`,
        })
            .from(schemas_1.properties);
        let result;
        if (conditions.length > 0) {
            result = await query
                .where((0, drizzle_orm_1.and)(...conditions))
                .limit(limit)
                .offset(offset)
                .orderBy((0, drizzle_orm_1.desc)(schemas_1.properties.createdAt));
        }
        else {
            result = await query
                .limit(limit)
                .offset(offset)
                .orderBy((0, drizzle_orm_1.desc)(schemas_1.properties.createdAt));
        }
        const propertyIds = result.map((p) => p.id);
        let allImages = [];
        if (propertyIds.length > 0) {
            allImages = await database_1.db
                .select({
                propertyId: schemas_1.propertyImages.propertyId,
                imageUrl: schemas_1.propertyImages.imageUrl,
                isPrimary: schemas_1.propertyImages.isPrimary,
            })
                .from(schemas_1.propertyImages)
                .where((0, drizzle_orm_1.sql) `${schemas_1.propertyImages.propertyId} IN ${drizzle_orm_1.sql.raw(`(${propertyIds.map((id) => `'${id}'`).join(",")})`)}`)
                .orderBy(schemas_1.propertyImages.isPrimary, schemas_1.propertyImages.createdAt);
        }
        return result.map((property) => {
            const propertyImagesList = allImages.filter((img) => img.propertyId === property.id);
            const thumbnailImage = propertyImagesList.find((img) => img.isPrimary)?.imageUrl ||
                propertyImagesList[0]?.imageUrl ||
                null;
            console.log(property);
            return {
                ...property,
                thumbnailImage,
                images: propertyImagesList.map((img) => img.imageUrl),
                status: property.unitCount === 0
                    ? "vacant"
                    : property.vacantUnits > 0
                        ? "vacant"
                        : "occupied",
                occupancyRate: property.unitCount > 0
                    ? Math.round((property.occupiedUnits / property.unitCount) * 100)
                    : 0,
            };
        });
    }
    async createProperty(propertyData) {
        const [owner] = await database_1.db
            .select()
            .from(schemas_1.owners)
            .where((0, drizzle_orm_1.eq)(schemas_1.owners.id, propertyData.ownerId))
            .limit(1);
        if (!owner) {
            throw new Error("Owner not found");
        }
        const { images, ...propertyWithoutImages } = propertyData;
        const [newProperty] = await database_1.db
            .insert(schemas_1.properties)
            .values({
            ...propertyWithoutImages,
            totalUnits: 0,
        })
            .returning();
        if (images && images.length > 0) {
            const imageRecords = images.map((imageUrl, index) => ({
                propertyId: newProperty.id,
                imageUrl,
                isPrimary: index === 0,
            }));
            await database_1.db.insert(schemas_1.propertyImages).values(imageRecords);
        }
        return newProperty;
    }
    async getPropertyById(propertyId) {
        const [property] = await database_1.db
            .select({
            id: schemas_1.properties.id,
            name: schemas_1.properties.name,
            category: schemas_1.properties.category,
            address: schemas_1.properties.address,
            lga: schemas_1.properties.lga,
            city: schemas_1.properties.city,
            state: schemas_1.properties.state,
            description: schemas_1.properties.description,
            amenities: schemas_1.properties.amenities,
            ownerId: schemas_1.properties.ownerId,
            organizationId: schemas_1.properties.organizationId,
            totalUnits: schemas_1.properties.totalUnits,
            createdAt: schemas_1.properties.createdAt,
            updatedAt: schemas_1.properties.updatedAt,
            owner: {
                id: schemas_1.owners.id,
                fullName: schemas_1.owners.fullName,
                email: schemas_1.owners.email,
                phone: schemas_1.owners.phone,
            },
        })
            .from(schemas_1.properties)
            .leftJoin(schemas_1.owners, (0, drizzle_orm_1.eq)(schemas_1.properties.ownerId, schemas_1.owners.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.properties.id, propertyId))
            .limit(1);
        if (!property) {
            return null;
        }
        const images = await database_1.db
            .select({
            imageUrl: schemas_1.propertyImages.imageUrl,
        })
            .from(schemas_1.propertyImages)
            .where((0, drizzle_orm_1.eq)(schemas_1.propertyImages.propertyId, propertyId));
        return {
            ...property,
            images: images.map((img) => img.imageUrl),
        };
    }
    async updateProperty(propertyId, updateData) {
        const existingProperty = await this.getPropertyById(propertyId);
        if (!existingProperty) {
            throw new Error("Property not found");
        }
        if (updateData.ownerId) {
            const [newOwner] = await database_1.db
                .select()
                .from(schemas_1.owners)
                .where((0, drizzle_orm_1.eq)(schemas_1.owners.id, updateData.ownerId))
                .limit(1);
            if (!newOwner) {
                throw new Error("New owner not found");
            }
        }
        if (updateData.images !== undefined) {
            await database_1.db
                .delete(schemas_1.propertyImages)
                .where((0, drizzle_orm_1.eq)(schemas_1.propertyImages.propertyId, propertyId));
            if (updateData.images.length > 0) {
                await database_1.db.insert(schemas_1.propertyImages).values(updateData.images.map((imageUrl, index) => ({
                    propertyId,
                    imageUrl,
                    isPrimary: index === 0,
                })));
            }
        }
        const { images, ...propertyUpdateData } = updateData;
        const [updatedProperty] = await database_1.db
            .update(schemas_1.properties)
            .set({
            ...propertyUpdateData,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schemas_1.properties.id, propertyId))
            .returning();
        return updatedProperty;
    }
    async deleteProperty(propertyId) {
        const existingProperty = await this.getPropertyById(propertyId);
        if (!existingProperty) {
            throw new Error("Property not found");
        }
        await database_1.db.delete(schemas_1.properties).where((0, drizzle_orm_1.eq)(schemas_1.properties.id, propertyId));
        return { message: "Property deleted successfully" };
    }
    async getPropertiesCount(filters) {
        const conditions = [];
        if (filters?.organizationId) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.properties.organizationId, filters.organizationId));
        }
        if (filters?.city) {
            conditions.push((0, drizzle_orm_1.ilike)(schemas_1.properties.city, `%${filters.city}%`));
        }
        if (filters?.state) {
            conditions.push((0, drizzle_orm_1.ilike)(schemas_1.properties.state, `%${filters.state}%`));
        }
        if (filters?.category) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.properties.category, filters.category));
        }
        if (filters?.ownerId) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.properties.ownerId, filters.ownerId));
        }
        if (conditions.length > 0) {
            const [result] = await database_1.db
                .select({ count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)` })
                .from(schemas_1.properties)
                .where((0, drizzle_orm_1.and)(...conditions));
            return result.count;
        }
        const [result] = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)` })
            .from(schemas_1.properties);
        return result.count;
    }
    async getPropertiesByOwner(ownerId) {
        return await database_1.db
            .select()
            .from(schemas_1.properties)
            .where((0, drizzle_orm_1.eq)(schemas_1.properties.ownerId, ownerId))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.properties.createdAt} DESC`);
    }
}
exports.propertyService = new PropertyService();
//# sourceMappingURL=property.service.js.map