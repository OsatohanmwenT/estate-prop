"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
class TenantService {
    async getAllTenants(limit, offset, search, organizationId) {
        const conditions = [(0, drizzle_orm_1.eq)(schemas_1.tenants.organizationId, organizationId)];
        if (search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schemas_1.tenants.fullName, `%${search}%`), (0, drizzle_orm_1.ilike)(schemas_1.tenants.email, `%${search}%`), (0, drizzle_orm_1.ilike)(schemas_1.tenants.phone, `%${search}%`)));
        }
        const allTenants = await database_1.db
            .select({
            id: schemas_1.tenants.id,
            fullName: schemas_1.tenants.fullName,
            email: schemas_1.tenants.email,
            phone: schemas_1.tenants.phone,
            nokName: schemas_1.tenants.nokName,
            nokPhone: schemas_1.tenants.nokPhone,
            createdAt: schemas_1.tenants.createdAt,
            propertyName: schemas_1.properties.name,
            propertyAddress: schemas_1.properties.address,
            unitType: schemas_1.propertyUnits.type,
            rentAmount: schemas_1.leases.rentAmount,
            status: schemas_1.leases.status,
            avatarUrl: (0, drizzle_orm_1.sql) `null`,
        })
            .from(schemas_1.tenants)
            .leftJoin(schemas_1.leases, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.tenants.id, schemas_1.leases.tenantId), (0, drizzle_orm_1.eq)(schemas_1.leases.status, "active")))
            .leftJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .leftJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.and)(...conditions))
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.tenants.createdAt));
        console.log(allTenants);
        return allTenants;
    }
    async addTenant(tenantData) {
        const newTenant = await database_1.db
            .insert(schemas_1.tenants)
            .values({
            fullName: tenantData.fullName,
            email: tenantData.email,
            phone: tenantData.phone,
            nokName: tenantData.nokName || null,
            nokPhone: tenantData.nokPhone || null,
            annualIncome: tenantData.annualIncome?.toString() || null,
            metadata: tenantData.metadata || null,
            organizationId: tenantData.organizationId,
        })
            .returning();
        return newTenant;
    }
    async updateTenant(tenantId, tenantData) {
        const dataToUpdate = { ...tenantData };
        if (tenantData.annualIncome !== undefined) {
            dataToUpdate.annualIncome = tenantData.annualIncome?.toString() || null;
        }
        const [updatedTenant] = await database_1.db
            .update(schemas_1.tenants)
            .set(dataToUpdate)
            .where((0, drizzle_orm_1.eq)(schemas_1.tenants.id, tenantId))
            .returning();
        return updatedTenant || null;
    }
    async getTenantById(tenantId) {
        const [tenant] = await database_1.db
            .select()
            .from(schemas_1.tenants)
            .where((0, drizzle_orm_1.eq)(schemas_1.tenants.id, tenantId))
            .limit(1);
        return tenant || null;
    }
    async deleteTenantById(tenantId) {
        const [deletedTenant] = await database_1.db
            .delete(schemas_1.tenants)
            .where((0, drizzle_orm_1.eq)(schemas_1.tenants.id, tenantId))
            .returning();
        return deletedTenant || null;
    }
    async getTenantsCount(search, organizationId) {
        const conditions = [];
        if (organizationId) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.tenants.organizationId, organizationId));
        }
        if (search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schemas_1.tenants.fullName, `%${search}%`), (0, drizzle_orm_1.ilike)(schemas_1.tenants.email, `%${search}%`), (0, drizzle_orm_1.ilike)(schemas_1.tenants.phone, `%${search}%`)));
        }
        const [result] = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)` })
            .from(schemas_1.tenants)
            .where(conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined);
        return result?.count || 0;
    }
    async checkTenantEmailExists(email, excludeId) {
        const query = database_1.db
            .select({ id: schemas_1.tenants.id })
            .from(schemas_1.tenants)
            .where((0, drizzle_orm_1.eq)(schemas_1.tenants.email, email))
            .limit(1);
        const [result] = await query;
        if (result && excludeId && result.id === excludeId) {
            return false;
        }
        return !!result;
    }
}
exports.tenantService = new TenantService();
//# sourceMappingURL=tenant.service.js.map