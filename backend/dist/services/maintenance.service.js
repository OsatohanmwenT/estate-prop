"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const maintenance_1 = require("../database/schemas/maintenance");
const property_1 = require("../database/schemas/property");
const unit_1 = require("../database/schemas/unit");
const user_1 = require("../database/schemas/user");
const logger_1 = require("../utils/logger");
class MaintenanceService {
    async createMaintenanceRequest(data) {
        try {
            const [request] = await database_1.db
                .insert(maintenance_1.maintenanceRequests)
                .values({
                ...data,
                estimatedCost: data.estimatedCost
                    ? data.estimatedCost.toString()
                    : undefined,
            })
                .returning();
            await this.createLog({
                maintenanceRequestId: request.id,
                userId: data.reportedBy,
                action: "created",
                description: `Maintenance request created: ${data.title}`,
                newValue: JSON.stringify({
                    type: data.type,
                    priority: data.priority || "medium",
                    status: "pending",
                }),
            });
            logger_1.logger.info(`✅ Maintenance request created: ${request.id}`);
            return request;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to create maintenance request:", error);
            throw error;
        }
    }
    async updateMaintenanceRequest(id, userId, updates) {
        try {
            const [current] = await database_1.db
                .select()
                .from(maintenance_1.maintenanceRequests)
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.id, id));
            if (!current) {
                throw new Error("Maintenance request not found");
            }
            const [updated] = await database_1.db
                .update(maintenance_1.maintenanceRequests)
                .set({
                ...updates,
                estimatedCost: updates.estimatedCost
                    ? updates.estimatedCost.toString()
                    : undefined,
                actualCost: updates.actualCost
                    ? updates.actualCost.toString()
                    : undefined,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.id, id))
                .returning();
            if (updates.status && updates.status !== current.status) {
                await this.createLog({
                    maintenanceRequestId: id,
                    userId,
                    action: "status_changed",
                    description: `Status changed from ${current.status} to ${updates.status}`,
                    previousValue: current.status,
                    newValue: updates.status,
                });
            }
            if (updates.assignedTo && updates.assignedTo !== current.assignedTo) {
                await this.createLog({
                    maintenanceRequestId: id,
                    userId,
                    action: "assigned",
                    description: `Assigned to user`,
                    previousValue: current.assignedTo || "unassigned",
                    newValue: updates.assignedTo,
                });
            }
            if (updates.priority && updates.priority !== current.priority) {
                await this.createLog({
                    maintenanceRequestId: id,
                    userId,
                    action: "priority_changed",
                    description: `Priority changed from ${current.priority} to ${updates.priority}`,
                    previousValue: current.priority,
                    newValue: updates.priority,
                });
            }
            if (updates.actualCost &&
                updates.actualCost.toString() !== current.actualCost) {
                await this.createLog({
                    maintenanceRequestId: id,
                    userId,
                    action: "cost_updated",
                    description: `Actual cost updated`,
                    previousValue: current.actualCost || "0",
                    newValue: updates.actualCost.toString(),
                });
            }
            if (updates.status === "completed") {
                await this.createLog({
                    maintenanceRequestId: id,
                    userId,
                    action: "completed",
                    description: `Maintenance request completed`,
                    newValue: new Date().toISOString(),
                });
            }
            logger_1.logger.info(`✅ Maintenance request updated: ${id}`);
            return updated;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to update maintenance request:", error);
            throw error;
        }
    }
    async getMaintenanceRequestById(id) {
        try {
            const [request] = await database_1.db
                .select({
                id: maintenance_1.maintenanceRequests.id,
                organizationId: maintenance_1.maintenanceRequests.organizationId,
                title: maintenance_1.maintenanceRequests.title,
                description: maintenance_1.maintenanceRequests.description,
                type: maintenance_1.maintenanceRequests.type,
                priority: maintenance_1.maintenanceRequests.priority,
                status: maintenance_1.maintenanceRequests.status,
                propertyId: maintenance_1.maintenanceRequests.propertyId,
                unitId: maintenance_1.maintenanceRequests.unitId,
                reportedBy: maintenance_1.maintenanceRequests.reportedBy,
                assignedTo: maintenance_1.maintenanceRequests.assignedTo,
                estimatedCost: maintenance_1.maintenanceRequests.estimatedCost,
                actualCost: maintenance_1.maintenanceRequests.actualCost,
                scheduledDate: maintenance_1.maintenanceRequests.scheduledDate,
                completedAt: maintenance_1.maintenanceRequests.completedAt,
                vendorNotes: maintenance_1.maintenanceRequests.vendorNotes,
                managerNotes: maintenance_1.maintenanceRequests.managerNotes,
                createdAt: maintenance_1.maintenanceRequests.createdAt,
                updatedAt: maintenance_1.maintenanceRequests.updatedAt,
                property: {
                    id: property_1.properties.id,
                    name: property_1.properties.name,
                    address: property_1.properties.address,
                },
                unit: {
                    id: unit_1.propertyUnits.id,
                    unitNumber: unit_1.propertyUnits.code,
                },
                reporter: {
                    id: user_1.users.id,
                    fullName: user_1.users.fullName,
                    email: user_1.users.email,
                },
            })
                .from(maintenance_1.maintenanceRequests)
                .leftJoin(property_1.properties, (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.propertyId, property_1.properties.id))
                .leftJoin(unit_1.propertyUnits, (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.unitId, unit_1.propertyUnits.id))
                .leftJoin(user_1.users, (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.reportedBy, user_1.users.id))
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.id, id));
            if (!request) {
                return null;
            }
            let assignee = null;
            if (request.assignedTo) {
                const [assigneeData] = await database_1.db
                    .select({
                    id: user_1.users.id,
                    fullName: user_1.users.fullName,
                    email: user_1.users.email,
                })
                    .from(user_1.users)
                    .where((0, drizzle_orm_1.eq)(user_1.users.id, request.assignedTo));
                assignee = assigneeData;
            }
            const logs = await this.getLogsByRequestId(id);
            return {
                ...request,
                assignee,
                logs,
            };
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to get maintenance request:", error);
            throw error;
        }
    }
    async getMaintenanceRequests(filters) {
        try {
            let query = database_1.db
                .select({
                id: maintenance_1.maintenanceRequests.id,
                title: maintenance_1.maintenanceRequests.title,
                description: maintenance_1.maintenanceRequests.description,
                type: maintenance_1.maintenanceRequests.type,
                priority: maintenance_1.maintenanceRequests.priority,
                status: maintenance_1.maintenanceRequests.status,
                propertyId: maintenance_1.maintenanceRequests.propertyId,
                unitId: maintenance_1.maintenanceRequests.unitId,
                reportedBy: maintenance_1.maintenanceRequests.reportedBy,
                assignedTo: maintenance_1.maintenanceRequests.assignedTo,
                estimatedCost: maintenance_1.maintenanceRequests.estimatedCost,
                actualCost: maintenance_1.maintenanceRequests.actualCost,
                scheduledDate: maintenance_1.maintenanceRequests.scheduledDate,
                completedAt: maintenance_1.maintenanceRequests.completedAt,
                createdAt: maintenance_1.maintenanceRequests.createdAt,
                updatedAt: maintenance_1.maintenanceRequests.updatedAt,
                property: {
                    name: property_1.properties.name,
                    address: property_1.properties.address,
                },
                unit: {
                    unitNumber: unit_1.propertyUnits.code,
                },
                reporter: {
                    fullName: user_1.users.fullName,
                    email: user_1.users.email,
                },
            })
                .from(maintenance_1.maintenanceRequests)
                .leftJoin(property_1.properties, (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.propertyId, property_1.properties.id))
                .leftJoin(unit_1.propertyUnits, (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.unitId, unit_1.propertyUnits.id))
                .leftJoin(user_1.users, (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.reportedBy, user_1.users.id))
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.organizationId, filters.organizationId))
                .orderBy((0, drizzle_orm_1.desc)(maintenance_1.maintenanceRequests.createdAt))
                .limit(filters.limit || 50)
                .offset(filters.offset || 0);
            const requests = await query;
            return requests;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to get maintenance requests:", error);
            throw error;
        }
    }
    async createLog(data) {
        try {
            await database_1.db.insert(maintenance_1.maintenanceLogs).values(data);
            logger_1.logger.info(`📝 Maintenance log created for request: ${data.maintenanceRequestId}`);
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to create maintenance log:", error);
            throw error;
        }
    }
    async addComment(maintenanceRequestId, userId, comment) {
        try {
            await this.createLog({
                maintenanceRequestId,
                userId,
                action: "comment_added",
                description: "Comment added",
                notes: comment,
            });
            logger_1.logger.info(`💬 Comment added to maintenance request: ${maintenanceRequestId}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to add comment:", error);
            throw error;
        }
    }
    async getLogsByRequestId(maintenanceRequestId) {
        try {
            const logs = await database_1.db
                .select({
                id: maintenance_1.maintenanceLogs.id,
                maintenanceRequestId: maintenance_1.maintenanceLogs.maintenanceRequestId,
                userId: maintenance_1.maintenanceLogs.userId,
                action: maintenance_1.maintenanceLogs.action,
                description: maintenance_1.maintenanceLogs.description,
                previousValue: maintenance_1.maintenanceLogs.previousValue,
                newValue: maintenance_1.maintenanceLogs.newValue,
                notes: maintenance_1.maintenanceLogs.notes,
                createdAt: maintenance_1.maintenanceLogs.createdAt,
                user: {
                    id: user_1.users.id,
                    fullName: user_1.users.fullName,
                    email: user_1.users.email,
                },
            })
                .from(maintenance_1.maintenanceLogs)
                .leftJoin(user_1.users, (0, drizzle_orm_1.eq)(maintenance_1.maintenanceLogs.userId, user_1.users.id))
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceLogs.maintenanceRequestId, maintenanceRequestId))
                .orderBy((0, drizzle_orm_1.desc)(maintenance_1.maintenanceLogs.createdAt));
            return logs;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to get maintenance logs:", error);
            throw error;
        }
    }
    async deleteMaintenanceRequest(id, userId) {
        try {
            await database_1.db
                .delete(maintenance_1.maintenanceRequests)
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.id, id));
            logger_1.logger.info(`🗑️ Maintenance request deleted: ${id}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to delete maintenance request:", error);
            throw error;
        }
    }
    async getStatistics(organizationId) {
        try {
            const allRequests = await database_1.db
                .select()
                .from(maintenance_1.maintenanceRequests)
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.organizationId, organizationId));
            const stats = {
                total: allRequests.length,
                pending: allRequests.filter((r) => r.status === "pending").length,
                inProgress: allRequests.filter((r) => r.status === "in_progress")
                    .length,
                completed: allRequests.filter((r) => r.status === "completed").length,
                cancelled: allRequests.filter((r) => r.status === "cancelled").length,
                totalCost: allRequests.reduce((sum, r) => sum + Number(r.actualCost || 0), 0),
            };
            return stats;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to get maintenance statistics:", error);
            throw error;
        }
    }
    async getMaintenanceByProperty(propertyId, organizationId) {
        try {
            const requests = await database_1.db
                .select({
                id: maintenance_1.maintenanceRequests.id,
                title: maintenance_1.maintenanceRequests.title,
                description: maintenance_1.maintenanceRequests.description,
                type: maintenance_1.maintenanceRequests.type,
                priority: maintenance_1.maintenanceRequests.priority,
                status: maintenance_1.maintenanceRequests.status,
                estimatedCost: maintenance_1.maintenanceRequests.estimatedCost,
                actualCost: maintenance_1.maintenanceRequests.actualCost,
                receipts: maintenance_1.maintenanceRequests.receipts,
                scheduledDate: maintenance_1.maintenanceRequests.scheduledDate,
                completedAt: maintenance_1.maintenanceRequests.completedAt,
                createdAt: maintenance_1.maintenanceRequests.createdAt,
                unit: {
                    id: unit_1.propertyUnits.id,
                    unitNumber: unit_1.propertyUnits.code,
                },
            })
                .from(maintenance_1.maintenanceRequests)
                .leftJoin(unit_1.propertyUnits, (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.unitId, unit_1.propertyUnits.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.propertyId, propertyId), (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.organizationId, organizationId)))
                .orderBy((0, drizzle_orm_1.desc)(maintenance_1.maintenanceRequests.createdAt));
            const totalSpent = requests.reduce((sum, r) => sum + Number(r.actualCost || 0), 0);
            return {
                requests,
                totalSpent,
                count: requests.length,
            };
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to get property maintenance history:", error);
            throw error;
        }
    }
    async getMaintenanceByUnit(unitId, organizationId) {
        try {
            const requests = await database_1.db
                .select({
                id: maintenance_1.maintenanceRequests.id,
                title: maintenance_1.maintenanceRequests.title,
                description: maintenance_1.maintenanceRequests.description,
                type: maintenance_1.maintenanceRequests.type,
                priority: maintenance_1.maintenanceRequests.priority,
                status: maintenance_1.maintenanceRequests.status,
                estimatedCost: maintenance_1.maintenanceRequests.estimatedCost,
                actualCost: maintenance_1.maintenanceRequests.actualCost,
                receipts: maintenance_1.maintenanceRequests.receipts,
                scheduledDate: maintenance_1.maintenanceRequests.scheduledDate,
                completedAt: maintenance_1.maintenanceRequests.completedAt,
                createdAt: maintenance_1.maintenanceRequests.createdAt,
            })
                .from(maintenance_1.maintenanceRequests)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.unitId, unitId), (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.organizationId, organizationId)))
                .orderBy((0, drizzle_orm_1.desc)(maintenance_1.maintenanceRequests.createdAt));
            const totalSpent = requests.reduce((sum, r) => sum + Number(r.actualCost || 0), 0);
            return {
                requests,
                totalSpent,
                count: requests.length,
            };
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to get unit maintenance history:", error);
            throw error;
        }
    }
    async getMaintenanceNeedingReminders(organizationId) {
        try {
            const now = new Date();
            const requests = await database_1.db
                .select({
                id: maintenance_1.maintenanceRequests.id,
                title: maintenance_1.maintenanceRequests.title,
                status: maintenance_1.maintenanceRequests.status,
                reminderDate: maintenance_1.maintenanceRequests.reminderDate,
                reminderSent: maintenance_1.maintenanceRequests.reminderSent,
                assignedTo: maintenance_1.maintenanceRequests.assignedTo,
                property: {
                    name: property_1.properties.name,
                },
            })
                .from(maintenance_1.maintenanceRequests)
                .leftJoin(property_1.properties, (0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.propertyId, property_1.properties.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.organizationId, organizationId), (0, drizzle_orm_1.inArray)(maintenance_1.maintenanceRequests.status, ["pending", "in_progress"]), (0, drizzle_orm_1.sql) `${maintenance_1.maintenanceRequests.reminderDate} IS NOT NULL`, (0, drizzle_orm_1.sql) `${maintenance_1.maintenanceRequests.reminderDate} <= ${now}`, (0, drizzle_orm_1.sql) `(${maintenance_1.maintenanceRequests.reminderSent} IS NULL OR ${maintenance_1.maintenanceRequests.reminderSent} < ${maintenance_1.maintenanceRequests.reminderDate})`));
            return requests;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to get maintenance needing reminders:", error);
            throw error;
        }
    }
    async markReminderSent(maintenanceRequestId) {
        try {
            await database_1.db
                .update(maintenance_1.maintenanceRequests)
                .set({ reminderSent: new Date() })
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.id, maintenanceRequestId));
            logger_1.logger.info(`✅ Reminder marked as sent for: ${maintenanceRequestId}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to mark reminder as sent:", error);
            throw error;
        }
    }
    async addReceipt(maintenanceRequestId, receiptUrl, userId) {
        try {
            const [current] = await database_1.db
                .select()
                .from(maintenance_1.maintenanceRequests)
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.id, maintenanceRequestId));
            if (!current) {
                throw new Error("Maintenance request not found");
            }
            const receipts = current.receipts || [];
            receipts.push(receiptUrl);
            await database_1.db
                .update(maintenance_1.maintenanceRequests)
                .set({ receipts })
                .where((0, drizzle_orm_1.eq)(maintenance_1.maintenanceRequests.id, maintenanceRequestId));
            await this.createLog({
                maintenanceRequestId,
                userId,
                action: "updated",
                description: "Receipt added",
                newValue: receiptUrl,
            });
            logger_1.logger.info(`📄 Receipt added to maintenance request: ${maintenanceRequestId}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error("❌ Failed to add receipt:", error);
            throw error;
        }
    }
}
exports.maintenanceService = new MaintenanceService();
//# sourceMappingURL=maintenance.service.js.map