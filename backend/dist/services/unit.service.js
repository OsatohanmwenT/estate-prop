"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
class UnitService {
    async getUnitsByPropertyId(propertyId, limit = 20, offset = 0, organizationId) {
        let query = database_1.db
            .select({
            id: schemas_1.propertyUnits.id,
            code: schemas_1.propertyUnits.code,
            description: schemas_1.propertyUnits.description,
            type: schemas_1.propertyUnits.type,
            propertyId: schemas_1.propertyUnits.propertyId,
            amenities: schemas_1.propertyUnits.amenities,
            floor: schemas_1.propertyUnits.floor,
            bedrooms: schemas_1.propertyUnits.bedrooms,
            bathrooms: schemas_1.propertyUnits.bathrooms,
            unitSize: schemas_1.propertyUnits.unitSize,
            status: schemas_1.propertyUnits.status,
            condition: schemas_1.propertyUnits.condition,
            rentAmount: schemas_1.propertyUnits.rentAmount,
            createdAt: schemas_1.propertyUnits.createdAt,
            updatedAt: schemas_1.propertyUnits.updatedAt,
            tenant: {
                id: schemas_1.tenants.id,
                fullName: schemas_1.tenants.fullName,
                email: schemas_1.tenants.email,
            },
        })
            .from(schemas_1.propertyUnits)
            .leftJoin(schemas_1.leases, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id), (0, drizzle_orm_1.eq)(schemas_1.leases.status, "active")))
            .leftJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.tenants.id, schemas_1.leases.tenantId));
        if (organizationId) {
            query = query
                .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.properties.id, schemas_1.propertyUnits.propertyId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId), (0, drizzle_orm_1.eq)(schemas_1.properties.organizationId, organizationId)));
        }
        else {
            query = query.where((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId));
        }
        const unitsList = await query
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.propertyUnits.createdAt));
        return unitsList.map((unit) => ({
            ...unit,
            tenant: unit.tenant && unit.tenant.id ? unit.tenant : null,
        }));
    }
    async createUnit(unitData) {
        const newUnit = await database_1.db
            .insert(schemas_1.propertyUnits)
            .values({
            propertyId: unitData.propertyId,
            code: unitData.code,
            type: unitData.type,
            rentAmount: unitData.rentAmount,
            floor: unitData.floor,
            condition: unitData.condition,
            unitSize: unitData.unitSize,
            bedrooms: unitData.bedrooms,
            bathrooms: unitData.bathrooms,
            status: unitData.status,
            description: unitData.description,
            amenities: unitData.amenities,
            managementFeePercentage: unitData.managementFeePercentage || "0.00",
            managementFeeFixed: unitData.managementFeeFixed || "0.00",
        })
            .returning();
        await this.updatePropertyUnitCount(unitData.propertyId);
        return newUnit;
    }
    async getUnitsByPropertyIdAndStatus(propertyId, status, limit = 10, offset = 0, organizationId) {
        const conditions = [
            (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId),
            (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.status, status),
        ];
        let query = database_1.db.select().from(schemas_1.propertyUnits);
        if (organizationId) {
            query = query
                .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.properties.id, schemas_1.propertyUnits.propertyId))
                .where((0, drizzle_orm_1.and)(...conditions, (0, drizzle_orm_1.eq)(schemas_1.properties.organizationId, organizationId)));
        }
        else {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        const unitsList = await query
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.propertyUnits.createdAt));
        return unitsList;
    }
    async getUnitsCountByProperty(propertyId, status, organizationId) {
        const conditions = [(0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId)];
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.status, status));
        }
        let query = database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)` })
            .from(schemas_1.propertyUnits);
        if (organizationId) {
            query = query
                .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.properties.id, schemas_1.propertyUnits.propertyId))
                .where((0, drizzle_orm_1.and)(...conditions, (0, drizzle_orm_1.eq)(schemas_1.properties.organizationId, organizationId)));
        }
        else {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        const [result] = await query;
        return result.count;
    }
    async getUnitStatsByProperty(propertyId) {
        const [stats] = await database_1.db
            .select({
            total: (0, drizzle_orm_1.sql) `cast(count(*) as integer)`,
            vacant: (0, drizzle_orm_1.sql) `cast(sum(case when status = 'vacant' then 1 else 0 end) as integer)`,
            occupied: (0, drizzle_orm_1.sql) `cast(sum(case when status = 'occupied' then 1 else 0 end) as integer)`,
            avgRent: (0, drizzle_orm_1.sql) `cast(avg(cast(rent_amount as decimal)) as decimal(12,2))`,
            totalSize: (0, drizzle_orm_1.sql) `cast(sum(unit_size) as integer)`,
        })
            .from(schemas_1.propertyUnits)
            .where((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId));
        return {
            totalUnits: stats.total || 0,
            vacantUnits: stats.vacant || 0,
            occupiedUnits: stats.occupied || 0,
            occupancyRate: stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0,
            averageRent: stats.avgRent || 0,
            totalSquareMeters: stats.totalSize || 0,
        };
    }
    async checkPropertyExists(propertyId) {
        const [result] = await database_1.db
            .select({ id: schemas_1.properties.id })
            .from(schemas_1.properties)
            .where((0, drizzle_orm_1.eq)(schemas_1.properties.id, propertyId))
            .limit(1);
        return !!result;
    }
    async findUnitByCodeAndProperty(unitCode, propertyId) {
        const [unit] = await database_1.db
            .select()
            .from(schemas_1.propertyUnits)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.code, unitCode), (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId)))
            .limit(1);
        return unit || null;
    }
    async getUnitById(unitId, propertyId) {
        const result = await database_1.db
            .select({
            id: schemas_1.propertyUnits.id,
            code: schemas_1.propertyUnits.code,
            description: schemas_1.propertyUnits.description,
            type: schemas_1.propertyUnits.type,
            propertyId: schemas_1.propertyUnits.propertyId,
            amenities: schemas_1.propertyUnits.amenities,
            floor: schemas_1.propertyUnits.floor,
            bedrooms: schemas_1.propertyUnits.bedrooms,
            bathrooms: schemas_1.propertyUnits.bathrooms,
            unitSize: schemas_1.propertyUnits.unitSize,
            status: schemas_1.propertyUnits.status,
            condition: schemas_1.propertyUnits.condition,
            rentAmount: schemas_1.propertyUnits.rentAmount,
            createdAt: schemas_1.propertyUnits.createdAt,
            updatedAt: schemas_1.propertyUnits.updatedAt,
            tenant: {
                id: schemas_1.tenants.id,
                fullName: schemas_1.tenants.fullName,
                email: schemas_1.tenants.email,
            },
        })
            .from(schemas_1.propertyUnits)
            .leftJoin(schemas_1.leases, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id), (0, drizzle_orm_1.eq)(schemas_1.leases.status, "active")))
            .leftJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.tenants.id, schemas_1.leases.tenantId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.id, unitId), (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId)))
            .limit(1);
        if (!result[0])
            return null;
        return {
            ...result[0],
            tenant: result[0].tenant && result[0].tenant.id ? result[0].tenant : null,
        };
    }
    async updateUnit(unitId, propertyId, updateData) {
        const [updatedUnit] = await database_1.db
            .update(schemas_1.propertyUnits)
            .set({
            ...updateData,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.id, unitId), (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId)))
            .returning();
        return updatedUnit || null;
    }
    async deleteUnit(unitId, propertyId) {
        const [deletedUnit] = await database_1.db
            .delete(schemas_1.propertyUnits)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.id, unitId), (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId)))
            .returning();
        if (deletedUnit) {
            await this.updatePropertyUnitCount(propertyId);
        }
        return deletedUnit || null;
    }
    async updatePropertyUnitCount(propertyId) {
        const count = await this.getUnitsCountByProperty(propertyId);
        await database_1.db
            .update(schemas_1.properties)
            .set({ totalUnits: count })
            .where((0, drizzle_orm_1.eq)(schemas_1.properties.id, propertyId));
        return count;
    }
    async getAllUnitsByOrganization(organizationId, limit = 20, offset = 0) {
        const unitsList = await database_1.db
            .select({
            id: schemas_1.propertyUnits.id,
            code: schemas_1.propertyUnits.code,
            type: schemas_1.propertyUnits.type,
            floor: schemas_1.propertyUnits.floor,
            bedrooms: schemas_1.propertyUnits.bedrooms,
            bathrooms: schemas_1.propertyUnits.bathrooms,
            unitSize: schemas_1.propertyUnits.unitSize,
            status: schemas_1.propertyUnits.status,
            rentAmount: schemas_1.propertyUnits.rentAmount,
            condition: schemas_1.propertyUnits.condition,
            createdAt: schemas_1.propertyUnits.createdAt,
            property: {
                id: schemas_1.properties.id,
                name: schemas_1.properties.name,
                address: schemas_1.properties.address,
                city: schemas_1.properties.city,
                state: schemas_1.properties.state,
            },
        })
            .from(schemas_1.propertyUnits)
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.properties.organizationId, organizationId))
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.propertyUnits.createdAt));
        return unitsList;
    }
    async getAllUnitsCountByOrganization(organizationId) {
        const [result] = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)` })
            .from(schemas_1.propertyUnits)
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.properties.organizationId, organizationId));
        return result.count;
    }
}
exports.unitService = new UnitService();
//# sourceMappingURL=unit.service.js.map