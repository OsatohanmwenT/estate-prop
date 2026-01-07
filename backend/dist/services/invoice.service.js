"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
class InvoiceService {
    async createInvoice(data) {
        let ownerAmount = data.ownerAmount;
        let managementFee = data.managementFee;
        if ((!ownerAmount || !managementFee) && data.leaseId) {
            const [lease] = await database_1.db
                .select({
                unitId: schemas_1.leases.unitId,
            })
                .from(schemas_1.leases)
                .where((0, drizzle_orm_1.eq)(schemas_1.leases.id, data.leaseId))
                .limit(1);
            if (lease) {
                const [unit] = await database_1.db
                    .select({
                    managementFeePercentage: schemas_1.propertyUnits.managementFeePercentage,
                    managementFeeFixed: schemas_1.propertyUnits.managementFeeFixed,
                })
                    .from(schemas_1.propertyUnits)
                    .where((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.id, lease.unitId))
                    .limit(1);
                if (unit) {
                    const amount = data.amount;
                    const feePercentage = parseFloat(unit.managementFeePercentage || "0");
                    const feeFixed = parseFloat(unit.managementFeeFixed || "0");
                    let calculatedFee = 0;
                    if (feePercentage > 0) {
                        calculatedFee = (amount * feePercentage) / 100;
                    }
                    else if (feeFixed > 0) {
                        calculatedFee = feeFixed;
                    }
                    managementFee = managementFee || calculatedFee;
                    ownerAmount = ownerAmount || amount - calculatedFee;
                }
            }
        }
        const [invoice] = await database_1.db
            .insert(schemas_1.invoices)
            .values({
            organizationId: data.organizationId,
            tenantId: data.tenantId,
            leaseId: data.leaseId || null,
            type: data.type,
            description: data.description,
            amount: data.amount.toString(),
            amountPaid: "0",
            ownerAmount: ownerAmount?.toString(),
            managementFee: managementFee?.toString(),
            dueDate: data.dueDate,
            status: data.status || "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        })
            .returning();
        return invoice;
    }
    async getInvoiceById(invoiceId) {
        const [result] = await database_1.db
            .select({
            id: schemas_1.invoices.id,
            organizationId: schemas_1.invoices.organizationId,
            leaseId: schemas_1.invoices.leaseId,
            tenantId: schemas_1.invoices.tenantId,
            type: schemas_1.invoices.type,
            description: schemas_1.invoices.description,
            amount: schemas_1.invoices.amount,
            amountPaid: schemas_1.invoices.amountPaid,
            ownerAmount: schemas_1.invoices.ownerAmount,
            managementFee: schemas_1.invoices.managementFee,
            dueDate: schemas_1.invoices.dueDate,
            status: schemas_1.invoices.status,
            createdAt: schemas_1.invoices.createdAt,
            updatedAt: schemas_1.invoices.updatedAt,
            tenant: {
                id: schemas_1.tenants.id,
                fullName: schemas_1.tenants.fullName,
                email: schemas_1.tenants.email,
                phone: schemas_1.tenants.phone,
            },
            lease: {
                id: schemas_1.leases.id,
                startDate: schemas_1.leases.startDate,
                endDate: schemas_1.leases.endDate,
                status: schemas_1.leases.status,
                unitId: schemas_1.leases.unitId,
            },
            unit: {
                id: schemas_1.propertyUnits.id,
                code: schemas_1.propertyUnits.code,
                type: schemas_1.propertyUnits.type,
                status: schemas_1.propertyUnits.status,
                propertyId: schemas_1.propertyUnits.propertyId,
                propertyName: schemas_1.properties.name,
                propertyAddress: schemas_1.properties.address,
                propertyCity: schemas_1.properties.city,
                propertyState: schemas_1.properties.state,
            },
        })
            .from(schemas_1.invoices)
            .leftJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.invoices.tenantId, schemas_1.tenants.id))
            .leftJoin(schemas_1.leases, (0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, schemas_1.leases.id))
            .leftJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .leftJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.invoices.id, invoiceId))
            .limit(1);
        if (!result)
            return null;
        const transactionsList = await database_1.db
            .select()
            .from(schemas_1.transactions)
            .where((0, drizzle_orm_1.eq)(schemas_1.transactions.invoiceId, invoiceId))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.transactions.paidAt} DESC`);
        return {
            ...result,
            transactions: transactionsList,
        };
    }
    async getAllInvoices(options) {
        const { status, leaseId, tenantId, propertyId, startDate, endDate, limit = 15, offset = 0, } = options || {};
        const conditions = [];
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.invoices.status, status));
        }
        if (leaseId) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, leaseId));
        }
        if (startDate) {
            conditions.push((0, drizzle_orm_1.gte)(schemas_1.invoices.dueDate, startDate));
        }
        if (endDate) {
            conditions.push((0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, endDate));
        }
        if (tenantId) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.invoices.tenantId, tenantId));
        }
        const results = await database_1.db
            .select({
            id: schemas_1.invoices.id,
            organizationId: schemas_1.invoices.organizationId,
            leaseId: schemas_1.invoices.leaseId,
            tenantId: schemas_1.invoices.tenantId,
            type: schemas_1.invoices.type,
            description: schemas_1.invoices.description,
            amount: schemas_1.invoices.amount,
            amountPaid: schemas_1.invoices.amountPaid,
            ownerAmount: schemas_1.invoices.ownerAmount,
            managementFee: schemas_1.invoices.managementFee,
            dueDate: schemas_1.invoices.dueDate,
            status: schemas_1.invoices.status,
            createdAt: schemas_1.invoices.createdAt,
            updatedAt: schemas_1.invoices.updatedAt,
            tenant: {
                id: schemas_1.tenants.id,
                fullName: schemas_1.tenants.fullName,
                email: schemas_1.tenants.email,
                phone: schemas_1.tenants.phone,
            },
            lease: {
                id: schemas_1.leases.id,
                startDate: schemas_1.leases.startDate,
                endDate: schemas_1.leases.endDate,
                status: schemas_1.leases.status,
                unitId: schemas_1.leases.unitId,
            },
            unit: {
                id: schemas_1.propertyUnits.id,
                code: schemas_1.propertyUnits.code,
                type: schemas_1.propertyUnits.type,
                status: schemas_1.propertyUnits.status,
                propertyId: schemas_1.propertyUnits.propertyId,
                propertyName: schemas_1.properties.name,
                propertyAddress: schemas_1.properties.address,
                propertyCity: schemas_1.properties.city,
                propertyState: schemas_1.properties.state,
            },
        })
            .from(schemas_1.invoices)
            .leftJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.invoices.tenantId, schemas_1.tenants.id))
            .leftJoin(schemas_1.leases, (0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, schemas_1.leases.id))
            .leftJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .leftJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.invoices.dueDate} DESC`);
        if (results.length > 0) {
            const invoiceIds = results.map((invoice) => invoice.id);
            const allTransactions = await database_1.db
                .select()
                .from(schemas_1.transactions)
                .where((0, drizzle_orm_1.sql) `${schemas_1.transactions.invoiceId} IN (${drizzle_orm_1.sql.raw(invoiceIds.map((id) => `'${id}'`).join(","))})`)
                .orderBy((0, drizzle_orm_1.sql) `${schemas_1.transactions.paidAt} DESC`);
            return results.map((invoice) => ({
                ...invoice,
                transactions: allTransactions.filter((t) => t.invoiceId === invoice.id),
            }));
        }
        return results;
    }
    async getInvoicesCount(options) {
        const { status, leaseId, tenantId, startDate, endDate } = options || {};
        const conditions = [];
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.invoices.status, status));
        }
        if (leaseId) {
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, leaseId));
        }
        if (startDate) {
            conditions.push((0, drizzle_orm_1.gte)(schemas_1.invoices.dueDate, startDate));
        }
        if (endDate) {
            conditions.push((0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, endDate));
        }
        if (tenantId) {
            const [result] = await database_1.db
                .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(schemas_1.invoices)
                .innerJoin(schemas_1.leases, (0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, schemas_1.leases.id))
                .where(conditions.length > 0
                ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, tenantId), ...conditions)
                : (0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, tenantId));
            return Number(result.count);
        }
        if (conditions.length > 0) {
            const [result] = await database_1.db
                .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(schemas_1.invoices)
                .where((0, drizzle_orm_1.and)(...conditions));
            return Number(result.count);
        }
        const [result] = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schemas_1.invoices);
        return Number(result.count);
    }
    async updateInvoice(invoiceId, data) {
        const [updatedInvoice] = await database_1.db
            .update(schemas_1.invoices)
            .set(data)
            .where((0, drizzle_orm_1.eq)(schemas_1.invoices.id, invoiceId))
            .returning();
        return updatedInvoice;
    }
    async recordPayment(invoiceId, data, userId) {
        return await database_1.db.transaction(async (tx) => {
            const [invoice] = await tx
                .select()
                .from(schemas_1.invoices)
                .where((0, drizzle_orm_1.eq)(schemas_1.invoices.id, invoiceId))
                .limit(1);
            if (!invoice) {
                throw new Error("Invoice not found");
            }
            const currentPaid = parseFloat(invoice.amountPaid || "0");
            const paymentAmount = data.amount;
            const newAmountPaid = currentPaid + paymentAmount;
            const totalAmount = parseFloat(invoice.amount);
            let newStatus = invoice.status;
            if (newAmountPaid >= totalAmount) {
                newStatus = "paid";
            }
            else if (newAmountPaid > 0) {
                newStatus = "partial";
            }
            const [updatedInvoice] = await tx
                .update(schemas_1.invoices)
                .set({
                status: newStatus,
                amountPaid: newAmountPaid.toString(),
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schemas_1.invoices.id, invoiceId))
                .returning();
            const [transaction] = await tx
                .insert(schemas_1.transactions)
                .values({
                organizationId: invoice.organizationId,
                invoiceId: invoice.id,
                tenantId: invoice.tenantId,
                amount: paymentAmount.toString(),
                method: data.method,
                reference: data.reference,
                paidAt: new Date(data.paidAt),
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                recordedBy: userId,
                receiptUrl: data.receiptUrl,
                createdAt: new Date(),
            })
                .returning();
            if (newStatus === "paid" && invoice.leaseId) {
                const [lease] = await tx
                    .select()
                    .from(schemas_1.leases)
                    .where((0, drizzle_orm_1.eq)(schemas_1.leases.id, invoice.leaseId))
                    .limit(1);
                if (lease && lease.status === "draft") {
                    const leaseService = require("./lease.service").default;
                    await leaseService.activateLease(invoice.leaseId);
                }
            }
            try {
                const { notificationService } = require("./notification.service");
                await notificationService.createInApp({
                    organizationId: invoice.organizationId,
                    type: "payment_received",
                    subject: "Payment Received",
                    message: `Payment of ₦${paymentAmount.toLocaleString()} received`,
                    metadata: {
                        invoiceId,
                        amount: paymentAmount,
                        method: data.method,
                        transactionId: transaction.id,
                    },
                });
            }
            catch (e) {
                console.error("Failed to create payment notification:", e);
            }
            return { invoice: updatedInvoice, transaction };
        });
    }
    async deleteInvoice(invoiceId) {
        const [deletedInvoice] = await database_1.db
            .delete(schemas_1.invoices)
            .where((0, drizzle_orm_1.eq)(schemas_1.invoices.id, invoiceId))
            .returning();
        return deletedInvoice;
    }
    async getInvoicesByLease(leaseId) {
        return await database_1.db
            .select()
            .from(schemas_1.invoices)
            .where((0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, leaseId))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.invoices.dueDate} DESC`);
    }
    async getOverdueInvoices() {
        const now = new Date();
        return await database_1.db
            .select({
            id: schemas_1.invoices.id,
            leaseId: schemas_1.invoices.leaseId,
            amount: schemas_1.invoices.amount,
            dueDate: schemas_1.invoices.dueDate,
            status: schemas_1.invoices.status,
            createdAt: schemas_1.invoices.createdAt,
            leaseStartDate: schemas_1.leases.startDate,
            leaseEndDate: schemas_1.leases.endDate,
            leaseTenantId: schemas_1.leases.tenantId,
            tenantId: schemas_1.tenants.id,
            tenantName: schemas_1.tenants.fullName,
            tenantEmail: schemas_1.tenants.email,
            propertyId: schemas_1.properties.id,
            propertyName: schemas_1.properties.name,
            propertyAddress: schemas_1.properties.address,
        })
            .from(schemas_1.invoices)
            .innerJoin(schemas_1.leases, (0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, schemas_1.leases.id))
            .innerJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.tenants.id, schemas_1.leases.tenantId))
            .innerJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.invoices.status, "pending"), (0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, now)))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.invoices.dueDate} ASC`);
    }
    async updateOverdueInvoices() {
        const now = new Date();
        const overdueInvoices = await database_1.db
            .update(schemas_1.invoices)
            .set({
            status: "overdue",
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.invoices.status, "pending"), (0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, now)))
            .returning();
        if (overdueInvoices.length > 0) {
            try {
                const { notificationService } = require("./notification.service");
                for (const inv of overdueInvoices) {
                    await notificationService.createInApp({
                        organizationId: inv.organizationId,
                        type: "invoice_overdue",
                        subject: "Invoice Overdue",
                        message: `Invoice for ₦${parseFloat(inv.amount).toLocaleString()} is now overdue`,
                        metadata: { invoiceId: inv.id, amount: inv.amount },
                    });
                }
            }
            catch (e) {
                console.error("Failed to create overdue notifications:", e);
            }
        }
        return overdueInvoices;
    }
    async getUpcomingInvoices(daysAhead = 7) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        return await database_1.db
            .select({
            id: schemas_1.invoices.id,
            leaseId: schemas_1.invoices.leaseId,
            amount: schemas_1.invoices.amount,
            dueDate: schemas_1.invoices.dueDate,
            status: schemas_1.invoices.status,
            createdAt: schemas_1.invoices.createdAt,
            lease_startDate: schemas_1.leases.startDate,
            lease_endDate: schemas_1.leases.endDate,
            lease_tenantId: schemas_1.leases.tenantId,
            tenant_id: schemas_1.tenants.id,
            tenant_name: schemas_1.tenants.fullName,
            tenant_email: schemas_1.tenants.email,
            property_id: schemas_1.properties.id,
            property_name: schemas_1.properties.name,
            property_address: schemas_1.properties.address,
        })
            .from(schemas_1.invoices)
            .innerJoin(schemas_1.leases, (0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, schemas_1.leases.id))
            .innerJoin(schemas_1.tenants, (0, drizzle_orm_1.eq)(schemas_1.tenants.id, schemas_1.leases.tenantId))
            .innerJoin(schemas_1.propertyUnits, (0, drizzle_orm_1.eq)(schemas_1.leases.unitId, schemas_1.propertyUnits.id))
            .innerJoin(schemas_1.properties, (0, drizzle_orm_1.eq)(schemas_1.propertyUnits.propertyId, schemas_1.properties.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.invoices.status, "pending"), (0, drizzle_orm_1.gte)(schemas_1.invoices.dueDate, now), (0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, futureDate)))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.invoices.dueDate} ASC`);
    }
    async generateRecurringInvoice(leaseId) {
        const [lease] = await database_1.db
            .select()
            .from(schemas_1.leases)
            .where((0, drizzle_orm_1.eq)(schemas_1.leases.id, leaseId))
            .limit(1);
        if (!lease || lease.status !== "active") {
            throw new Error("Lease not found or not active");
        }
        const now = new Date();
        const leaseStart = new Date(lease.startDate);
        const monthsPassed = (now.getFullYear() - leaseStart.getFullYear()) * 12 +
            (now.getMonth() - leaseStart.getMonth());
        let cyclesPassed = 0;
        switch (lease.billingCycle) {
            case "monthly":
                cyclesPassed = monthsPassed;
                break;
            case "quarterly":
                cyclesPassed = Math.floor(monthsPassed / 3);
                break;
            case "biannually":
                cyclesPassed = Math.floor(monthsPassed / 6);
                break;
            case "annually":
                cyclesPassed = Math.floor(monthsPassed / 12);
                break;
        }
        const rentAmount = parseFloat(lease.rentAmount);
        const expectedPaid = rentAmount * Math.max(1, cyclesPassed);
        const [paymentStats] = await database_1.db
            .select({
            totalPaid: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schemas_1.invoices.amountPaid}), 0)`,
            totalOwed: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schemas_1.invoices.amount}), 0)`,
        })
            .from(schemas_1.invoices)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, leaseId), (0, drizzle_orm_1.eq)(schemas_1.invoices.type, "rent")));
        const totalPaid = parseFloat(paymentStats?.totalPaid || "0");
        if (totalPaid >= expectedPaid) {
            return null;
        }
        const [lastInvoice] = await database_1.db
            .select()
            .from(schemas_1.invoices)
            .where((0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, leaseId))
            .orderBy((0, drizzle_orm_1.sql) `${schemas_1.invoices.dueDate} DESC`)
            .limit(1);
        let nextDueDate;
        if (lastInvoice) {
            nextDueDate = new Date(lastInvoice.dueDate);
        }
        else {
            nextDueDate = new Date(lease.startDate);
        }
        switch (lease.billingCycle) {
            case "monthly":
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                break;
            case "quarterly":
                nextDueDate.setMonth(nextDueDate.getMonth() + 3);
                break;
            case "biannually":
                nextDueDate.setMonth(nextDueDate.getMonth() + 6);
                break;
            case "annually":
                nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                break;
        }
        if (nextDueDate > new Date(lease.endDate)) {
            return null;
        }
        const [existingInvoice] = await database_1.db
            .select()
            .from(schemas_1.invoices)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, leaseId), (0, drizzle_orm_1.eq)(schemas_1.invoices.dueDate, nextDueDate)))
            .limit(1);
        if (existingInvoice) {
            return null;
        }
        const [unit] = await database_1.db
            .select({
            managementFeePercentage: schemas_1.propertyUnits.managementFeePercentage,
            managementFeeFixed: schemas_1.propertyUnits.managementFeeFixed,
        })
            .from(schemas_1.propertyUnits)
            .where((0, drizzle_orm_1.eq)(schemas_1.propertyUnits.id, lease.unitId))
            .limit(1);
        let managementFee = 0;
        if (unit) {
            const feePercentage = parseFloat(unit.managementFeePercentage || "0");
            const feeFixed = parseFloat(unit.managementFeeFixed || "0");
            if (feePercentage > 0) {
                managementFee = (rentAmount * feePercentage) / 100;
            }
            else if (feeFixed > 0) {
                managementFee = feeFixed;
            }
        }
        const ownerAmount = rentAmount - managementFee;
        const [newInvoice] = await database_1.db
            .insert(schemas_1.invoices)
            .values({
            organizationId: lease.organizationId,
            tenantId: lease.tenantId,
            leaseId: leaseId,
            type: "rent",
            description: `Recurring ${lease.billingCycle} rent payment`,
            amount: lease.rentAmount,
            ownerAmount: ownerAmount.toFixed(2),
            managementFee: managementFee.toFixed(2),
            dueDate: nextDueDate,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        })
            .returning();
        return newInvoice;
    }
    async getInvoiceStats(options) {
        const { tenantId, propertyId, startDate, endDate } = options || {};
        const conditions = [];
        if (startDate) {
            conditions.push((0, drizzle_orm_1.gte)(schemas_1.invoices.dueDate, startDate));
        }
        if (endDate) {
            conditions.push((0, drizzle_orm_1.lte)(schemas_1.invoices.dueDate, endDate));
        }
        let query = database_1.db
            .select({
            status: schemas_1.invoices.status,
            count: (0, drizzle_orm_1.sql) `count(*)`,
            totalAmount: (0, drizzle_orm_1.sql) `sum(${schemas_1.invoices.amount})`,
        })
            .from(schemas_1.invoices);
        if (tenantId) {
            query = query.innerJoin(schemas_1.leases, (0, drizzle_orm_1.eq)(schemas_1.invoices.leaseId, schemas_1.leases.id));
            conditions.push((0, drizzle_orm_1.eq)(schemas_1.leases.tenantId, tenantId));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        const stats = await query.groupBy(schemas_1.invoices.status);
        return stats;
    }
}
exports.default = new InvoiceService();
//# sourceMappingURL=invoice.service.js.map