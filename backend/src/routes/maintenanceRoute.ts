/**
 * Maintenance Routes
 * Routes for maintenance request and log management
 */

import { Router } from "express";
import {
    addComment,
    addReceipt,
    createMaintenanceRequest,
    deleteMaintenanceRequest,
    getMaintenanceByProperty,
    getMaintenanceByUnit,
    getMaintenanceLogs,
    getMaintenanceRequestById,
    getMaintenanceRequests,
    getMaintenanceStatistics,
    getPendingReminders,
    markReminderSent,
    updateMaintenanceRequest,
} from "../controllers/maintenance.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: Router = Router();

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
