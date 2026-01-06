/**
 * Maintenance Routes
 * Routes for maintenance request and log management
 */

import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createMaintenanceRequest,
  getMaintenanceRequests,
  getMaintenanceRequestById,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
  addComment,
  addReceipt,
  getMaintenanceLogs,
  getMaintenanceStatistics,
  getMaintenanceByProperty,
  getMaintenanceByUnit,
  getPendingReminders,
  markReminderSent,
} from "../controllers/maintenance.controller";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Statistics and reports (before :id routes)
router.get("/statistics", getMaintenanceStatistics);
router.get("/reminders/pending", getPendingReminders);
router.get("/property/:propertyId", getMaintenanceByProperty);
router.get("/unit/:unitId", getMaintenanceByUnit);

// CRUD operations
router.post("/", createMaintenanceRequest);
router.get("/", getMaintenanceRequests);
router.get("/:id", getMaintenanceRequestById);
router.patch("/:id", updateMaintenanceRequest);
router.delete("/:id", deleteMaintenanceRequest);

// Comments, logs, and receipts
router.post("/:id/comments", addComment);
router.post("/:id/receipt", addReceipt);
router.post("/:id/reminder/send", markReminderSent);
router.get("/:id/logs", getMaintenanceLogs);

export default router;
