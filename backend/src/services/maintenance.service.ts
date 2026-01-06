/**
 * Maintenance Service
 * Handles maintenance requests and logs
 */

import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../database";
import {
    maintenanceLogs,
    maintenanceRequests,
} from "../database/schemas/maintenance";
import { properties } from "../database/schemas/property";
import { propertyUnits } from "../database/schemas/unit";
import { users } from "../database/schemas/user";
import type {
    CreateMaintenanceLogDTO,
    CreateMaintenanceRequestDTO,
    MaintenanceLogDTO,
    MaintenanceRequestFilters,
    UpdateMaintenanceRequestDTO
} from "../types/maintenance";
import { logger } from "../utils/logger";

class MaintenanceService {
  /**
   * Create a maintenance request with initial log
   */
  async createMaintenanceRequest(data: CreateMaintenanceRequestDTO) {
    try {
      const [request] = await db
        .insert(maintenanceRequests)
        .values({
          ...data,
          estimatedCost: data.estimatedCost ? data.estimatedCost.toString() : undefined,
        })
        .returning();

      // Create initial log
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

      logger.info(`✅ Maintenance request created: ${request.id}`);
      return request;
    } catch (error) {
      logger.error("❌ Failed to create maintenance request:", error);
      throw error;
    }
  }

  /**
   * Update a maintenance request and log the changes
   */
  async updateMaintenanceRequest(
    id: string,
    userId: string,
    updates: UpdateMaintenanceRequestDTO
  ) {
    try {
      // Get current state
      const [current] = await db
        .select()
        .from(maintenanceRequests)
        .where(eq(maintenanceRequests.id, id));

      if (!current) {
        throw new Error("Maintenance request not found");
      }

      // Update the request
      const [updated] = await db
        .update(maintenanceRequests)
        .set({
          ...updates,
          estimatedCost: updates.estimatedCost ? updates.estimatedCost.toString() : undefined,
          actualCost: updates.actualCost ? updates.actualCost.toString() : undefined,
          updatedAt: new Date(),
        })
        .where(eq(maintenanceRequests.id, id))
        .returning();

      // Create logs for specific changes
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

      if (updates.actualCost && updates.actualCost.toString() !== current.actualCost) {
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

      logger.info(`✅ Maintenance request updated: ${id}`);
      return updated;
    } catch (error) {
      logger.error("❌ Failed to update maintenance request:", error);
      throw error;
    }
  }

  /**
   * Get maintenance request with full details including logs
   */
  async getMaintenanceRequestById(id: string) {
    try {
      const [request] = await db
        .select({
          id: maintenanceRequests.id,
          organizationId: maintenanceRequests.organizationId,
          title: maintenanceRequests.title,
          description: maintenanceRequests.description,
          type: maintenanceRequests.type,
          priority: maintenanceRequests.priority,
          status: maintenanceRequests.status,
          propertyId: maintenanceRequests.propertyId,
          unitId: maintenanceRequests.unitId,
          reportedBy: maintenanceRequests.reportedBy,
          assignedTo: maintenanceRequests.assignedTo,
          estimatedCost: maintenanceRequests.estimatedCost,
          actualCost: maintenanceRequests.actualCost,
          scheduledDate: maintenanceRequests.scheduledDate,
          completedAt: maintenanceRequests.completedAt,
          vendorNotes: maintenanceRequests.vendorNotes,
          managerNotes: maintenanceRequests.managerNotes,
          createdAt: maintenanceRequests.createdAt,
          updatedAt: maintenanceRequests.updatedAt,
          property: {
            id: properties.id,
            name: properties.name,
            address: properties.address,
          },
          unit: {
            id: propertyUnits.id,
            unitNumber: propertyUnits.code,
          },
          reporter: {
            id: users.id,
            fullName: users.fullName,
            email: users.email,
          },
        })
        .from(maintenanceRequests)
        .leftJoin(properties, eq(maintenanceRequests.propertyId, properties.id))
        .leftJoin(
          propertyUnits,
          eq(maintenanceRequests.unitId, propertyUnits.id)
        )
        .leftJoin(users, eq(maintenanceRequests.reportedBy, users.id))
        .where(eq(maintenanceRequests.id, id));

      if (!request) {
        return null;
      }

      // Get assignee separately if exists
      let assignee = null;
      if (request.assignedTo) {
        const [assigneeData] = await db
          .select({
            id: users.id,
            fullName: users.fullName,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, request.assignedTo));
        assignee = assigneeData;
      }

      // Get logs
      const logs = await this.getLogsByRequestId(id);

      return {
        ...request,
        assignee,
        logs,
      };
    } catch (error) {
      logger.error("❌ Failed to get maintenance request:", error);
      throw error;
    }
  }

  /**
   * Get all maintenance requests with filters
   */
  async getMaintenanceRequests(filters: MaintenanceRequestFilters) {
    try {
      let query = db
        .select({
          id: maintenanceRequests.id,
          title: maintenanceRequests.title,
          description: maintenanceRequests.description,
          type: maintenanceRequests.type,
          priority: maintenanceRequests.priority,
          status: maintenanceRequests.status,
          propertyId: maintenanceRequests.propertyId,
          unitId: maintenanceRequests.unitId,
          reportedBy: maintenanceRequests.reportedBy,
          assignedTo: maintenanceRequests.assignedTo,
          estimatedCost: maintenanceRequests.estimatedCost,
          actualCost: maintenanceRequests.actualCost,
          scheduledDate: maintenanceRequests.scheduledDate,
          completedAt: maintenanceRequests.completedAt,
          createdAt: maintenanceRequests.createdAt,
          updatedAt: maintenanceRequests.updatedAt,
          property: {
            name: properties.name,
            address: properties.address,
          },
          unit: {
            unitNumber: propertyUnits.code,
          },
          reporter: {
            fullName: users.fullName,
            email: users.email,
          },
        })
        .from(maintenanceRequests)
        .leftJoin(properties, eq(maintenanceRequests.propertyId, properties.id))
        .leftJoin(
          propertyUnits,
          eq(maintenanceRequests.unitId, propertyUnits.id)
        )
        .leftJoin(users, eq(maintenanceRequests.reportedBy, users.id))
        .where(eq(maintenanceRequests.organizationId, filters.organizationId))
        .orderBy(desc(maintenanceRequests.createdAt))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0);

      const requests = await query;
      return requests;
    } catch (error) {
      logger.error("❌ Failed to get maintenance requests:", error);
      throw error;
    }
  }

  /**
   * Create a maintenance log entry
   */
  async createLog(data: CreateMaintenanceLogDTO): Promise<void> {
    try {
      await db.insert(maintenanceLogs).values(data);
      logger.info(`📝 Maintenance log created for request: ${data.maintenanceRequestId}`);
    } catch (error) {
      logger.error("❌ Failed to create maintenance log:", error);
      throw error;
    }
  }

  /**
   * Add a comment/note to a maintenance request
   */
  async addComment(
    maintenanceRequestId: string,
    userId: string,
    comment: string
  ) {
    try {
      await this.createLog({
        maintenanceRequestId,
        userId,
        action: "comment_added",
        description: "Comment added",
        notes: comment,
      });

      logger.info(`💬 Comment added to maintenance request: ${maintenanceRequestId}`);
      return true;
    } catch (error) {
      logger.error("❌ Failed to add comment:", error);
      throw error;
    }
  }

  /**
   * Get all logs for a maintenance request
   */
  async getLogsByRequestId(
    maintenanceRequestId: string
  ): Promise<MaintenanceLogDTO[]> {
    try {
      const logs = await db
        .select({
          id: maintenanceLogs.id,
          maintenanceRequestId: maintenanceLogs.maintenanceRequestId,
          userId: maintenanceLogs.userId,
          action: maintenanceLogs.action,
          description: maintenanceLogs.description,
          previousValue: maintenanceLogs.previousValue,
          newValue: maintenanceLogs.newValue,
          notes: maintenanceLogs.notes,
          createdAt: maintenanceLogs.createdAt,
          user: {
            id: users.id,
            fullName: users.fullName,
            email: users.email,
          },
        })
        .from(maintenanceLogs)
        .leftJoin(users, eq(maintenanceLogs.userId, users.id))
        .where(eq(maintenanceLogs.maintenanceRequestId, maintenanceRequestId))
        .orderBy(desc(maintenanceLogs.createdAt));

      return logs as MaintenanceLogDTO[];
    } catch (error) {
      logger.error("❌ Failed to get maintenance logs:", error);
      throw error;
    }
  }

  /**
   * Delete a maintenance request and all its logs
   */
  async deleteMaintenanceRequest(id: string, userId: string) {
    try {
      // Logs will be auto-deleted due to CASCADE
      await db
        .delete(maintenanceRequests)
        .where(eq(maintenanceRequests.id, id));

      logger.info(`🗑️ Maintenance request deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error("❌ Failed to delete maintenance request:", error);
      throw error;
    }
  }

  /**
   * Get maintenance statistics
   */
  async getStatistics(organizationId: string) {
    try {
      const allRequests = await db
        .select()
        .from(maintenanceRequests)
        .where(eq(maintenanceRequests.organizationId, organizationId));

      const stats = {
        total: allRequests.length,
        pending: allRequests.filter((r) => r.status === "pending").length,
        inProgress: allRequests.filter((r) => r.status === "in_progress").length,
        completed: allRequests.filter((r) => r.status === "completed").length,
        cancelled: allRequests.filter((r) => r.status === "cancelled").length,
        totalCost: allRequests.reduce(
          (sum, r) => sum + Number(r.actualCost || 0),
          0
        ),
      };

      return stats;
    } catch (error) {
      logger.error("❌ Failed to get maintenance statistics:", error);
      throw error;
    }
  }

  /**
   * Get maintenance history for a specific property
   */
  async getMaintenanceByProperty(propertyId: string, organizationId: string) {
    try {
      const requests = await db
        .select({
          id: maintenanceRequests.id,
          title: maintenanceRequests.title,
          description: maintenanceRequests.description,
          type: maintenanceRequests.type,
          priority: maintenanceRequests.priority,
          status: maintenanceRequests.status,
          estimatedCost: maintenanceRequests.estimatedCost,
          actualCost: maintenanceRequests.actualCost,
          receipts: maintenanceRequests.receipts,
          scheduledDate: maintenanceRequests.scheduledDate,
          completedAt: maintenanceRequests.completedAt,
          createdAt: maintenanceRequests.createdAt,
          unit: {
            id: propertyUnits.id,
            unitNumber: propertyUnits.code,
          },
        })
        .from(maintenanceRequests)
        .leftJoin(
          propertyUnits,
          eq(maintenanceRequests.unitId, propertyUnits.id)
        )
        .where(
          and(
            eq(maintenanceRequests.propertyId, propertyId),
            eq(maintenanceRequests.organizationId, organizationId)
          )
        )
        .orderBy(desc(maintenanceRequests.createdAt));

      const totalSpent = requests.reduce(
        (sum, r) => sum + Number(r.actualCost || 0),
        0
      );

      return {
        requests,
        totalSpent,
        count: requests.length,
      };
    } catch (error) {
      logger.error("❌ Failed to get property maintenance history:", error);
      throw error;
    }
  }

  /**
   * Get maintenance history for a specific unit
   */
  async getMaintenanceByUnit(unitId: string, organizationId: string) {
    try {
      const requests = await db
        .select({
          id: maintenanceRequests.id,
          title: maintenanceRequests.title,
          description: maintenanceRequests.description,
          type: maintenanceRequests.type,
          priority: maintenanceRequests.priority,
          status: maintenanceRequests.status,
          estimatedCost: maintenanceRequests.estimatedCost,
          actualCost: maintenanceRequests.actualCost,
          receipts: maintenanceRequests.receipts,
          scheduledDate: maintenanceRequests.scheduledDate,
          completedAt: maintenanceRequests.completedAt,
          createdAt: maintenanceRequests.createdAt,
        })
        .from(maintenanceRequests)
        .where(
          and(
            eq(maintenanceRequests.unitId, unitId),
            eq(maintenanceRequests.organizationId, organizationId)
          )
        )
        .orderBy(desc(maintenanceRequests.createdAt));

      const totalSpent = requests.reduce(
        (sum, r) => sum + Number(r.actualCost || 0),
        0
      );

      return {
        requests,
        totalSpent,
        count: requests.length,
      };
    } catch (error) {
      logger.error("❌ Failed to get unit maintenance history:", error);
      throw error;
    }
  }

  /**
   * Get maintenance requests that need reminders
   */
  async getMaintenanceNeedingReminders(organizationId: string) {
    try {
      const now = new Date();
      const requests = await db
        .select({
          id: maintenanceRequests.id,
          title: maintenanceRequests.title,
          status: maintenanceRequests.status,
          reminderDate: maintenanceRequests.reminderDate,
          reminderSent: maintenanceRequests.reminderSent,
          assignedTo: maintenanceRequests.assignedTo,
          property: {
            name: properties.name,
          },
        })
        .from(maintenanceRequests)
        .leftJoin(properties, eq(maintenanceRequests.propertyId, properties.id))
        .where(
          and(
            eq(maintenanceRequests.organizationId, organizationId),
            inArray(maintenanceRequests.status, ["pending", "in_progress"]),
            sql`${maintenanceRequests.reminderDate} IS NOT NULL`,
            sql`${maintenanceRequests.reminderDate} <= ${now}`,
            sql`(${maintenanceRequests.reminderSent} IS NULL OR ${maintenanceRequests.reminderSent} < ${maintenanceRequests.reminderDate})`
          )
        );

      return requests;
    } catch (error) {
      logger.error("❌ Failed to get maintenance needing reminders:", error);
      throw error;
    }
  }

  /**
   * Mark reminder as sent
   */
  async markReminderSent(maintenanceRequestId: string) {
    try {
      await db
        .update(maintenanceRequests)
        .set({ reminderSent: new Date() })
        .where(eq(maintenanceRequests.id, maintenanceRequestId));

      logger.info(`✅ Reminder marked as sent for: ${maintenanceRequestId}`);
      return true;
    } catch (error) {
      logger.error("❌ Failed to mark reminder as sent:", error);
      throw error;
    }
  }

  /**
   * Add receipt to maintenance request
   */
  async addReceipt(maintenanceRequestId: string, receiptUrl: string, userId: string) {
    try {
      const [current] = await db
        .select()
        .from(maintenanceRequests)
        .where(eq(maintenanceRequests.id, maintenanceRequestId));

      if (!current) {
        throw new Error("Maintenance request not found");
      }

      const receipts = current.receipts || [];
      receipts.push(receiptUrl);

      await db
        .update(maintenanceRequests)
        .set({ receipts })
        .where(eq(maintenanceRequests.id, maintenanceRequestId));

      // Log the receipt addition
      await this.createLog({
        maintenanceRequestId,
        userId,
        action: "updated",
        description: "Receipt added",
        newValue: receiptUrl,
      });

      logger.info(`📄 Receipt added to maintenance request: ${maintenanceRequestId}`);
      return true;
    } catch (error) {
      logger.error("❌ Failed to add receipt:", error);
      throw error;
    }
  }
}

export const maintenanceService = new MaintenanceService();
