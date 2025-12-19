import { Router } from "express";
import {
  createTenant,
  deleteTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
} from "../controllers/tenant.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../utils/validate";
import {
  createTenantSchema,
  updateTenantSchema,
} from "../validations/tenant.validation";

const tenantRouter: Router = Router();

tenantRouter.use(authenticate);

tenantRouter.get(
  "/",
  authorize(["owner", "manager", "surveyor"]),
  getAllTenants
);

tenantRouter.get(
  "/:id",
  authorize(["owner", "manager", "surveyor"]),
  getTenantById
);

tenantRouter.post(
  "/",
  authorize(["owner", "manager"]),
  validate(createTenantSchema),
  createTenant
);

tenantRouter.put(
  "/:id",
  authorize(["owner", "manager"]),
  validate(updateTenantSchema),
  updateTenant
);

tenantRouter.delete("/:id", authorize(["owner", "manager"]), deleteTenant);

export default tenantRouter;
