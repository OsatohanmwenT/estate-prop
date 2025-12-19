import { Router } from "express";
import {
  createLease,
  getActiveLeasesByTenant,
  getAllLeases,
  getLeaseById,
  getLeaseByUnit,
  getLeaseStats,
  terminateLease,
  updateLease,
} from "../controllers/lease.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../utils/validate";
import {
  createLeaseSchema,
  updateLeaseSchema,
} from "../validations/lease.validation";

const router: Router = Router();

router.use(authenticate);

router.post("/", validate(createLeaseSchema), createLease);

router.get("/", getAllLeases);

router.get("/stats", getLeaseStats);

router.get("/:leaseId", getLeaseById);

router.put(
  "/:leaseId",
  validate(updateLeaseSchema),
  updateLease
);

router.patch(
  "/:leaseId/terminate",
  terminateLease
);

router.get("/tenant/:tenantId", getActiveLeasesByTenant);

router.get("/unit/:unitId", getLeaseByUnit);

export default router;
