"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
class LeaseService {
    async createLease(data) {
        return await database_1.db.transaction(async (tx) => {
            const [unit] = await tx
                .select()
                .from(schemas_1.propertyUnits)
                .where((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.id, data.unitId));
            if (!unit) {
                throw new Error("Unit not found");
            }
            if (unit.status && unit.status === "occupied") {
                throw new Error("Unit is occupied and cannot be leased");
            }
            const overlapQuery = await tx
                .select()
                .from(schemas_1.leases)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.leases.unitId, data.unitId), (0, drizzle_orm_1.eq)(schemas_1.leases.status, "active"), (0, drizzle_orm_1.sql) `(coalesce(${schemas_1.leases.endDate}, 'infinity'::timestamptz) >= ${(0, drizzle_orm_1.sql) `${data.startDate}::timestamptz`} AND ${schemas_1.leases.startDate} <= ${data.endDate
                ? (0, drizzle_orm_1.sql) `${data.endDate}::timestamptz`
                : (0, drizzle_orm_1.sql) `'infinity'::timestamptz`})`))
                .limit(1);
            if (overlapQuery.length > 0) {
                throw new Error("Unit already has an active lease for the requested period");
            }
            const [lease] = await tx
                .insert(schemas_1.leases)
                .values({
                ...data,
                status: "draft",
            })
                .returning();
            const rentAmount = parseFloat(data.rentAmount);
            const cautionDeposit = data.cautionDeposit
                ? parseFloat(data.cautionDeposit)
                : 0;
            const agencyFee = data.agencyFee ? parseFloat(data.agencyFee) : 0;
            const legalFee = data.legalFee ? parseFloat(data.legalFee) : 0;
            const totalAmount = rentAmount + cautionDeposit + agencyFee + legalFee;
            const [invoice] = await tx
                .insert(schemas_1.invoices)
                .values({
                organizationId: data.organizationId,
                tenantId: data.tenantId,
                leaseId: lease.id,
                type: "rent",
                description: `Initial payment for lease (Rent + Agency Fee + Legal Fee + Caution Deposit)`,
                amount: totalAmount.toString(),
                amountPaid: "0",
                ownerAmount: rentAmount.toString(),
                managementFee: (agencyFee + legalFee).toString(),
                dueDate: data.startDate,
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date(),
            })
                .returning();
            return { lease, invoice };
        });
    }
    async getLeaseStats(organizationId) {
        const [result] = await database_1.db
            .select({
            totalLeases: (0, drizzle_orm_1.sql) `count(*)::int`,
            activeLeases: (0, drizzle_orm_1.sql) `count(*) FILTER (WHERE status = 'active')::int`,
            pendingLeases: (0, drizzle_orm_1.sql) `count(*) FILTER (WHERE status = 'pending')::int`,
            terminatedLeases: (0, drizzle_orm_1.sql) `count(*) FILTER (WHERE status = 'terminated')::int`,
            expiredLeases: (0, drizzle_orm_1.sql) `count(*) FILTER (WHERE status = 'expired')::int`,
            expiringSoon: (0, drizzle_orm_1.sql) `count(*) FILTER (WHERE status = 'active' AND end_date <= (now() + interval '30 days'))::int`,
        })
            .from(schemas_1.leases)
            .where((0, drizzle_orm_1.eq)(schemas_1.leases.organizationId, organizationId));
        return result;
    }
    async getLeaseById(leaseId) {
        const result = await database_1.db
            .select({
            id: schemas_1.leases.id,
            startDate: schemas_1.leases.startDate,
            endDate: schemas_1.leases.endDate,
            rentAmount: schemas_1.leases.rentAmount,
            status: schemas_1.leases.status,
            tenantId: schemas_1.leases.tenantId,
            billingCycle: schemas_1.leases.billingCycle,
            unitId: schemas_1.leases.unitId,
            cautionDeposit: schemas_1.leases.cautionDeposit,
            agencyFee: schemas_1.leases.agencyFee,
            legalFee: schemas_1.leases.legalFee,
            notes: schemas_1.leases.notes,
            agreementUrl: schemas_1.leases.agreementUrl,
            createdAt: schemas_1.leases.createdAt,
            updatedAt: schemas_1.leases.updatedAt,
            tenant: {
                id: schemas_1.tenants.id,
                fullName: schemas_1.tenants.fullName,
                email: schemas_1.tenants.email,
                phone: schemas_1.tenants.phone,
            },
            unit: {
                id: schemas_1.propertyUnits.id,
                code: schemas_1.propertyUnits.code,
                type: schemas_1.propertyUnits.type,
                status: schemas_1.propertyUnits.status,
                propertyId: schemas_1.propertyUnits.propertyId,
            },
            property: {
                id: schemas_1.properties.id,
                name: schemas_1.properties.name,
                address: schemas_1.properties.address,
                city: schemas_1.properties.city,
                state: schemas_1.properties.state,
            },
        })
            .from(schemas_1.leases)
            .leftJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, schemas_1.tenants.id))
            .leftJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .leftJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.leases.id, leaseId))
            .limit(1);
        return result[0] || null;
    }
    async getAllLeases(options) {
        const { status, tenantId, unitId, propertyId, organizationId, limit = 15, offset = 0, } = options || {};
        const conditions = [];
        if (status)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.leases.status, status));
        if (tenantId)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, tenantId));
        if (unitId)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.leases.unitId, unitId));
        if (propertyId)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId));
        if (organizationId)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.properties.organizationId, organizationId));
        return await database_1.db
            .select({
            id: schemas_1.leases.id,
            startDate: schemas_1.leases.startDate,
            endDate: schemas_1.leases.endDate,
            rentAmount: schemas_1.leases.rentAmount,
            status: schemas_1.leases.status,
            tenantId: schemas_1.leases.tenantId,
            billingCycle: schemas_1.leases.billingCycle,
            unitId: schemas_1.leases.unitId,
            cautionDeposit: schemas_1.leases.cautionDeposit,
            notes: schemas_1.leases.notes,
            agreementUrl: schemas_1.leases.agreementUrl,
            createdAt: schemas_1.leases.createdAt,
            updatedAt: schemas_1.leases.updatedAt,
            tenant: {
                id: schemas_1.tenants.id,
                fullName: schemas_1.tenants.fullName,
                email: schemas_1.tenants.email,
                phone: schemas_1.tenants.phone,
            },
            unit: {
                id: schemas_1.propertyUnits.id,
                code: schemas_1.propertyUnits.code,
                type: schemas_1.propertyUnits.type,
                status: schemas_1.propertyUnits.status,
                propertyId: schemas_1.propertyUnits.propertyId,
            },
            property: {
                id: schemas_1.properties.id,
                name: schemas_1.properties.name,
                address: schemas_1.properties.address,
                city: schemas_1.properties.city,
                state: schemas_1.properties.state,
            },
        })
            .from(schemas_1.leases)
            .leftJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, schemas_1.tenants.id))
            .innerJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.leases.createdAt));
    }
    async getLeasesCount(options) {
        const { status, tenantId, unitId, propertyId, organizationId } = options || {};
        const conditions = [];
        if (status)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.leases.status, status));
        if (tenantId)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, tenantId));
        if (unitId)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.leases.unitId, unitId));
        if (propertyId)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, propertyId));
        if (organizationId)
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.properties.organizationId, organizationId));
        const [result] = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)::int` })
            .from(schemas_1.leases)
            .innerJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined);
        return Number(result.count);
    }
    async updateLease(leaseId, data) {
        const [updatedLease] = await database_1.db
            .update(schemas_1.leases)
            .set({
            ...data,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schemas_1.leases.id, leaseId))
            .returning();
        return updatedLease;
    }
    async terminateLease(leaseId, data) {
        return await database_1.db.transaction(async (tx) => {
            const updateData = {
                status: "terminated",
                updatedAt: new Date(),
            };
            if (data?.reason) {
                const [existingLease] = await tx
                    .select({ notes: schemas_1.leases.notes })
                    .from(schemas_1.leases)
                    .where((0, drizzle_orm_1.eq)(schemas_1.leases.id, leaseId));
                const terminationNote = `\n\n--- TERMINATED ---\nDate: ${data.terminationDate || new Date().toISOString().split("T")[0]}\nReason: ${data.reason}`;
                updateData.notes = existingLease?.notes
                    ? existingLease.notes + terminationNote
                    : terminationNote.trim();
            }
            const [terminatedLease] = await tx
                .update(schemas_1.leases)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schemas_1.leases.id, leaseId))
                .returning();
            if (terminatedLease) {
                await tx
                    .update(schemas_1.propertyUnits)
                    .set({ status: "vacant", updatedAt: new Date() })
                    .where((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.id, terminatedLease.unitId));
            }
            return terminatedLease;
        });
    }
    async getActiveLeasesByTenant(tenantId) {
        return await database_1.db
            .select()
            .from(schemas_1.leases)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, tenantId), (0, drizzle_orm_1.eq)(schemas_1.leases.status, "active")))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.leases.createdAt} DESC`);
    }
    async getLeaseByUnit(unitId) {
        const [lease] = await database_1.db
            .select()
            .from(schemas_1.leases)
            .where((0, drizzle_orm_1.eq)(schemas_1.leases.unitId, unitId))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.leases.createdAt} DESC`)
            .limit(1);
        return lease;
    }
    async updateExpiredLeases() {
        const now = new Date();
        return await database_1.db.transaction(async (tx) => {
            const expiredLeases = await tx
                .update(schemas_1.leases)
                .set({
                status: "expired",
                updatedAt: now,
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.leases.status, "active"), (0, drizzle_orm_1.lte)(schemas_1.leases.endDate, now)))
                .returning();
            if (expiredLeases.length > 0) {
                const unitIds = expiredLeases.map((lease) => lease.unitId);
                await tx
                    .update(schemas_1.propertyUnits)
                    .set({ status: "vacant", updatedAt: now })
                    .where((0, drizzle_orm_1.sql) `${schemas_1.propertyUnits.id} IN (${drizzle_orm_1.sql.join(unitIds.map((id) => (0, drizzle_orm_1.sql) `${id}`), (0, drizzle_orm_1.sql) `, `)})`);
            }
            return expiredLeases;
        });
    }
    async activateLease(leaseId) {
        return await database_1.db.transaction(async (tx) => {
            const [lease] = await tx
                .select()
                .from(schemas_1.leases)
                .where((0, drizzle_orm_1.eq)(schemas_1.leases.id, leaseId))
                .limit(1);
            if (!lease) {
                throw new Error("Lease not found");
            }
            if (lease.status !== "draft") {
                throw new Error("Only draft leases can be activated");
            }
            const [updatedLease] = await tx
                .update(schemas_1.leases)
                .set({
                status: "active",
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schemas_1.leases.id, leaseId))
                .returning();
            await tx
                .update(schemas_1.propertyUnits)
                .set({ status: "occupied", updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.id, lease.unitId));
            return updatedLease;
        });
    }
}
exports.default = new LeaseService();
//# sourceMappingURL=lease.service.js.map