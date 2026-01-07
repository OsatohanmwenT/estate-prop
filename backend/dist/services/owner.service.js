"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
class OwnerService {
    async createOwner(ownerData) {
        const { fullName, email, phone, address, organizationId, managedBy } = ownerData;
        const existingOwner = await this.findOwnerByEmail(email);
        if (existingOwner) {
            throw new Error("Owner with this email already exists");
        }
        const [newOwner] = await database_1.db
            .insert(schemas_1.owners)
            .values({
            fullName,
            email,
            phone,
            address,
            organizationId,
            managedBy: managedBy || null,
        })
            .returning({
            id: schemas_1.owners.id,
            fullName: schemas_1.owners.fullName,
            email: schemas_1.owners.email,
            phone: schemas_1.owners.phone,
            address: schemas_1.owners.address,
            managedBy: schemas_1.owners.managedBy,
            createdAt: schemas_1.owners.createdAt,
        });
        return newOwner;
    }
    async findOwnerByEmail(email) {
        const [owner] = await database_1.db
            .select()
            .from(schemas_1.owners)
            .where((0, drizzle_orm_1.eq)(schemas_1.owners.email, email))
            .limit(1);
        return owner || null;
    }
    async findOwnerById(id) {
        const [owner] = await database_1.db
            .select()
            .from(schemas_1.owners)
            .where((0, drizzle_orm_1.eq)(schemas_1.owners.id, id))
            .limit(1);
        return owner || null;
    }
    async getOwnerWithDetails(id) {
        const [owner] = await database_1.db
            .select()
            .from(schemas_1.owners)
            .where((0, drizzle_orm_1.eq)(schemas_1.owners.id, id))
            .limit(1);
        if (!owner) {
            return null;
        }
        const ownerProperties = await database_1.db
            .select({
            id: schemas_1.properties.id,
            name: schemas_1.properties.name,
            address: schemas_1.properties.address,
            city: schemas_1.properties.city,
            state: schemas_1.properties.state,
            category: schemas_1.properties.category,
            createdAt: schemas_1.properties.createdAt,
        })
            .from(schemas_1.properties)
            .where((0, drizzle_orm_1.eq)(schemas_1.properties.ownerId, id));
        const propertyIds = ownerProperties.map((p) => p.id);
        let totalUnits = 0;
        let totalRevenue = "0";
        let managementFeeTotal = "0";
        let ownerShareTotal = "0";
        if (propertyIds.length > 0) {
            const [unitsCount] = await database_1.db
                .select({
                count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)`,
            })
                .from(schemas_1.propertyUnits)
                .where((0, drizzle_orm_1.sql) `${schemas_1.propertyUnits.propertyId} IN (${drizzle_orm_1.sql.raw(propertyIds.map((id) => `'${id}'`).join(","))})`);
            totalUnits = unitsCount.count;
            const [revenueResult] = await database_1.db
                .select({
                total: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schemas_1.invoices.amountPaid}), 0)::text`,
                managementFee: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schemas_1.invoices.managementFee}), 0)::text`,
                ownerShare: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schemas_1.invoices.ownerAmount}), 0)::text`,
            })
                .from(schemas_1.invoices)
                .innerJoin(schemas_1.leases, (0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, schemas_1.leases.id))
                .innerJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
                .where((0, drizzle_orm_1.sql) `${schemas_1.propertyUnits.propertyId} IN (${drizzle_orm_1.sql.raw(propertyIds.map((id) => `'${id}'`).join(","))})`);
            totalRevenue = revenueResult.total;
            managementFeeTotal = revenueResult.managementFee;
            ownerShareTotal = revenueResult.ownerShare;
        }
        return {
            ...owner,
            propertiesCount: ownerProperties.length,
            unitsCount: totalUnits,
            totalRevenue,
            managementFeeTotal,
            ownerShareTotal,
            properties: ownerProperties,
        };
    }
    async getAllOwners(options) {
        const { search, managedBy, limit = 5, offset = 0 } = options || {};
        const conditions = [];
        if (search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schemas_1.owners.fullName, `%${search}%`), (0, drizzle_orm_1.ilike)(schemas_1.owners.email, `%${search}%`), (0, drizzle_orm_1.ilike)(schemas_1.owners.phone, `%${search}%`)));
        }
        if (managedBy) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.owners.managedBy, managedBy));
        }
        if (conditions.length > 0) {
            return await database_1.db
                .select()
                .from(schemas_1.owners)
                .where((0, drizzle_orm_1.and)(...conditions))
                .limit(limit)
                .offset(offset);
        }
        return await database_1.db.select().from(schemas_1.owners).limit(limit).offset(offset);
    }
    async updateOwner(id, updateData) {
        const existingOwner = await this.findOwnerById(id);
        if (!existingOwner) {
            throw new Error("Owner not found");
        }
        if (updateData.email && updateData.email !== existingOwner.email) {
            const ownerWithEmail = await this.findOwnerByEmail(updateData.email);
            if (ownerWithEmail) {
                throw new Error("Email already in use by another owner");
            }
        }
        const [updatedOwner] = await database_1.db
            .update(schemas_1.owners)
            .set({
            ...updateData,
            ...(updateData.managedBy !== undefined && {
                managedBy: updateData.managedBy,
            }),
        })
            .where((0, drizzle_orm_1.eq)(schemas_1.owners.id, id))
            .returning({
            id: schemas_1.owners.id,
            fullName: schemas_1.owners.fullName,
            email: schemas_1.owners.email,
            phone: schemas_1.owners.phone,
            address: schemas_1.owners.address,
            managedBy: schemas_1.owners.managedBy,
            createdAt: schemas_1.owners.createdAt,
        });
        return updatedOwner;
    }
    async deleteOwner(id) {
        const existingOwner = await this.findOwnerById(id);
        if (!existingOwner) {
            throw new Error("Owner not found");
        }
        await database_1.db.delete(schemas_1.owners).where((0, drizzle_orm_1.eq)(schemas_1.owners.id, id));
        return { message: "Owner deleted successfully" };
    }
    async getOwnersCount() {
        const [result] = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)` })
            .from(schemas_1.owners);
        return result.count;
    }
}
exports.ownerService = new OwnerService();
//# sourceMappingURL=owner.service.js.map