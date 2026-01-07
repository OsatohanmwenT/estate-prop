"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
class DashboardService {
    calculateDaysDifference(date1, date2) {
        const diffTime = date1.getTime() - date2.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    async getOverdueRentSummary() {
        const now = new Date();
        const result = await database_1.db
            .select({
            totalAmount: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schemas_1.invoices.amount}), 0)`,
            tenantCount: (0, drizzle_orm_1.sql) `COUNT(DISTINCT ${schemas_1.invoices.tenantId})`,
            invoiceCount: (0, drizzle_orm_1.sql) `COUNT(${schemas_1.invoices.id})`,
        })
            .from(schemas_1.invoices)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.invoices.status, "overdue"), (0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, now)));
        return {
            totalAmount: result[0]?.totalAmount || "0",
            tenantCount: Number(result[0]?.tenantCount) || 0,
            invoiceCount: Number(result[0]?.invoiceCount) || 0,
        };
    }
    async getOccupancyRate() {
        const result = await database_1.db
            .select({
            total: (0, drizzle_orm_1.sql) `CAST(COUNT(*) AS INTEGER)`,
            occupied: (0, drizzle_orm_1.sql) `CAST(SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) AS INTEGER)`,
            vacant: (0, drizzle_orm_1.sql) `CAST(SUM(CASE WHEN status = 'vacant' THEN 1 ELSE 0 END) AS INTEGER)`,
        })
            .from(schemas_1.propertyUnits);
        const totalUnits = Number(result[0]?.total) || 0;
        const occupiedUnits = Number(result[0]?.occupied) || 0;
        const vacantUnits = Number(result[0]?.vacant) || 0;
        const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
        return {
            occupancyRate,
            occupiedUnits,
            vacantUnits,
            totalUnits,
        };
    }
    async getPendingPaymentsCount() {
        const result = await database_1.db
            .select({
            count: (0, drizzle_orm_1.sql) `CAST(COUNT(*) AS INTEGER)`,
            totalAmount: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schemas_1.invoices.amount}), 0)`,
        })
            .from(schemas_1.invoices)
            .where((0, drizzle_orm_1.eq)(schemas_1.invoices.status, "pending"));
        return {
            count: Number(result[0]?.count) || 0,
            totalAmount: result[0]?.totalAmount || "0",
        };
    }
    async getUpcomingLeaseExpirations(daysAhead = 60) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const expiringLeases = await database_1.db
            .select({
            lease_id: schemas_1.leases.id,
            lease_endDate: schemas_1.leases.endDate,
            lease_rentAmount: schemas_1.leases.rentAmount,
            tenant_id: schemas_1.tenants.id,
            tenant_name: schemas_1.tenants.fullName,
            tenant_email: schemas_1.tenants.email,
            tenant_phone: schemas_1.tenants.phone,
            unit_id: schemas_1.propertyUnits.id,
            unit_name: schemas_1.propertyUnits.code,
            property_id: schemas_1.properties.id,
            property_name: schemas_1.properties.name,
            property_address: schemas_1.properties.address,
        })
            .from(schemas_1.leases)
            .innerJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, schemas_1.tenants.id))
            .innerJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.leases.status, "active"), (0, drizzle_orm_1.gte)(schemas_1.leases.endDate, now), (0, drizzle_orm_1.lte)(schemas_1.leases.endDate, futureDate)))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.leases.endDate} ASC`)
            .limit(10);
        return expiringLeases.map((lease) => ({
            leaseId: lease.lease_id,
            endDate: lease.lease_endDate,
            rentAmount: lease.lease_rentAmount,
            tenant: {
                id: lease.tenant_id,
                name: lease.tenant_name,
                email: lease.tenant_email,
                phone: lease.tenant_phone,
            },
            unit: {
                id: lease.unit_id,
                name: lease.unit_name,
            },
            property: {
                id: lease.property_id,
                name: lease.property_name,
                address: lease.property_address,
            },
        }));
    }
    async getUpcomingLeaseItems(daysAhead = 60) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const expiringLeases = await database_1.db
            .select({
            lease_id: schemas_1.leases.id,
            lease_endDate: schemas_1.leases.endDate,
            tenant_id: schemas_1.tenants.id,
            tenant_name: schemas_1.tenants.fullName,
            tenant_email: schemas_1.tenants.email,
            tenant_phone: schemas_1.tenants.phone,
            unit_id: schemas_1.propertyUnits.id,
            unit_name: schemas_1.propertyUnits.code,
            property_id: schemas_1.properties.id,
            property_name: schemas_1.properties.name,
        })
            .from(schemas_1.leases)
            .innerJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, schemas_1.tenants.id))
            .innerJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.leases.status, "active"), (0, drizzle_orm_1.gte)(schemas_1.leases.endDate, now), (0, drizzle_orm_1.lte)(schemas_1.leases.endDate, futureDate)))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.leases.endDate} ASC`);
        return expiringLeases.map((lease) => ({
            id: lease.lease_id.toString(),
            tenantName: lease.tenant_name,
            unitInfo: `${lease.unit_name}, ${lease.property_name}`,
            expiryDate: lease.lease_endDate.toISOString(),
            daysUntilExpiry: this.calculateDaysDifference(new Date(lease.lease_endDate), now),
            phoneNumber: lease.tenant_phone,
            email: lease.tenant_email,
        }));
    }
    async getDashboardSummary() {
        const [overdueRent, occupancy, pendingPayments, upcomingExpirations] = await Promise.all([
            this.getOverdueRentSummary(),
            this.getOccupancyRate(),
            this.getPendingPaymentsCount(),
            this.getUpcomingLeaseExpirations(60),
        ]);
        return {
            overdueRent: {
                totalAmount: overdueRent.totalAmount,
                tenantCount: overdueRent.tenantCount,
                invoiceCount: overdueRent.invoiceCount,
            },
            occupancy: {
                rate: occupancy.occupancyRate,
                occupiedUnits: occupancy.occupiedUnits,
                vacantUnits: occupancy.vacantUnits,
                totalUnits: occupancy.totalUnits,
            },
            pendingPayments: {
                count: pendingPayments.count,
                totalAmount: pendingPayments.totalAmount,
            },
            upcomingLeaseExpirations: {
                count: upcomingExpirations.length,
                leases: upcomingExpirations,
            },
        };
    }
    async getTenantsWithOverdueRent() {
        const now = new Date();
        const tenantsWithOverdue = await database_1.db
            .select({
            tenant_id: schemas_1.tenants.id,
            tenant_name: schemas_1.tenants.fullName,
            tenant_email: schemas_1.tenants.email,
            tenant_phone: schemas_1.tenants.phone,
            totalOverdue: (0, drizzle_orm_1.sql) `SUM(${schemas_1.invoices.amount})`,
            overdueCount: (0, drizzle_orm_1.sql) `COUNT(${schemas_1.invoices.id})`,
            oldestDueDate: (0, drizzle_orm_1.sql) `MIN(${schemas_1.invoices.dueDate})`,
        })
            .from(schemas_1.invoices)
            .innerJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.invoices.tenantId, schemas_1.tenants.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.invoices.status, "overdue"), (0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, now)))
            .groupBy(schemas_1.tenants.id, schemas_1.tenants.fullName, schemas_1.tenants.email, schemas_1.tenants.phone)
            .orderBy((0, drizzle_orm_1.sql) `MIN(${schemas_1.invoices.dueDate}) ASC`);
        return tenantsWithOverdue.map((tenant) => ({
            id: tenant.tenant_id,
            name: tenant.tenant_name,
            email: tenant.tenant_email,
            phone: tenant.tenant_phone,
            totalOverdue: tenant.totalOverdue,
            overdueCount: Number(tenant.overdueCount),
            oldestDueDate: tenant.oldestDueDate,
        }));
    }
    async getOverdueRentItems() {
        const now = new Date();
        const overdueItems = await database_1.db
            .select({
            invoice_id: schemas_1.invoices.id,
            invoice_amount: schemas_1.invoices.amount,
            invoice_dueDate: schemas_1.invoices.dueDate,
            tenant_id: schemas_1.tenants.id,
            tenant_name: schemas_1.tenants.fullName,
            tenant_phone: schemas_1.tenants.phone,
            tenant_email: schemas_1.tenants.email,
            unit_id: schemas_1.propertyUnits.id,
            unit_name: schemas_1.propertyUnits.code,
            property_id: schemas_1.properties.id,
            property_name: schemas_1.properties.name,
            property_address: schemas_1.properties.address,
        })
            .from(schemas_1.invoices)
            .innerJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.invoices.tenantId, schemas_1.tenants.id))
            .innerJoin(schemas_1.leases, (0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, schemas_1.leases.id))
            .innerJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.invoices.status, "overdue"), (0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, now)))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.invoices.dueDate} ASC`);
        return overdueItems.map((item) => ({
            id: item.invoice_id,
            tenantName: item.tenant_name,
            unitInfo: `${item.unit_name}, ${item.property_name}`,
            amount: item.invoice_amount,
            dueDate: item.invoice_dueDate.toISOString(),
            daysOverdue: this.calculateDaysDifference(now, new Date(item.invoice_dueDate)),
            phoneNumber: item.tenant_phone,
            email: item.tenant_email,
        }));
    }
    async getVacantUnits() {
        const vacantUnits = await database_1.db
            .select({
            unit_id: schemas_1.propertyUnits.id,
            unit_name: schemas_1.propertyUnits.code,
            unit_type: schemas_1.propertyUnits.type,
            unit_rentAmount: schemas_1.propertyUnits.rentAmount,
            unit_bedrooms: schemas_1.propertyUnits.bedrooms,
            unit_bathrooms: schemas_1.propertyUnits.bathrooms,
            property_id: schemas_1.properties.id,
            property_name: schemas_1.properties.name,
            property_address: schemas_1.properties.address,
        })
            .from(schemas_1.propertyUnits)
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.status, "vacant"))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.propertyUnits.createdAt} DESC`);
        return vacantUnits.map((unit) => ({
            id: unit.unit_id,
            name: unit.unit_name,
            type: unit.unit_type,
            rentAmount: unit.unit_rentAmount,
            bedrooms: unit.unit_bedrooms,
            bathrooms: unit.unit_bathrooms,
            property: {
                id: unit.property_id,
                name: unit.property_name,
                address: unit.property_address,
            },
        }));
    }
    async getPendingPaymentDetails(limit) {
        const query = database_1.db
            .select({
            invoice_id: schemas_1.invoices.id,
            invoice_amount: schemas_1.invoices.amount,
            invoice_dueDate: schemas_1.invoices.dueDate,
            invoice_amountPaid: schemas_1.invoices.amountPaid,
            invoice_description: schemas_1.invoices.description,
            tenant_id: schemas_1.tenants.id,
            tenant_name: schemas_1.tenants.fullName,
            tenant_phone: schemas_1.tenants.phone,
            unit_name: schemas_1.propertyUnits.code,
            property_name: schemas_1.properties.name,
        })
            .from(schemas_1.invoices)
            .innerJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.invoices.tenantId, schemas_1.tenants.id))
            .innerJoin(schemas_1.leases, (0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, schemas_1.leases.id))
            .innerJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.invoices.status, "pending"))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.invoices.dueDate} DESC`);
        const pendingPayments = limit ? await query.limit(limit) : await query;
        return pendingPayments.map((payment) => ({
            id: payment.invoice_id,
            amount: payment.invoice_amount,
            dueDate: payment.invoice_dueDate.toISOString(),
            paymentDate: "",
            tenantId: payment.tenant_id,
            tenantName: payment.tenant_name,
            tenantPhone: payment.tenant_phone,
            propertyUnit: `${payment.property_name}, ${payment.unit_name}`,
            note: payment.invoice_description,
        }));
    }
    async getPendingPaymentsWidget() {
        return this.getPendingPaymentDetails(7);
    }
    async getAllPendingPayments() {
        return this.getPendingPaymentDetails();
    }
    async getRevenueProjections() {
        const now = new Date();
        const months = [];
        for (let i = 0; i < 6; i++) {
            const targetDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + i + 1, 0);
            const monthName = targetDate.toLocaleString("default", {
                month: "short",
            });
            const potentialResult = await database_1.db
                .select({
                total: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schemas_1.leases.rentAmount}), 0)`,
            })
                .from(schemas_1.leases)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.leases.status, "active"), (0, drizzle_orm_1.lte)(schemas_1.leases.startDate, monthEnd), (0, drizzle_orm_1.gte)(schemas_1.leases.endDate, targetDate)));
            const securedResult = await database_1.db
                .select({
                total: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schemas_1.invoices.amount}), 0)`,
            })
                .from(schemas_1.invoices)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.invoices.status, "paid"), (0, drizzle_orm_1.gte)(schemas_1.invoices.dueDate, targetDate), (0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, monthEnd)));
            months.push({
                month: monthName,
                secured: parseFloat(securedResult[0]?.total || "0"),
                potential: parseFloat(potentialResult[0]?.total || "0"),
            });
        }
        return months;
    }
}
exports.default = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map