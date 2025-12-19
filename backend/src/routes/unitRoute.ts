import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  getUnitById,
  updateUnit,
  deleteUnit,
  getAllUnits,
} from "../controllers/unit.controller";
import { validate } from "../utils/validate";
import { updateUnitSchema } from "../validations/unit.validation";

const unitRouter: Router = Router();

unitRouter.use(authenticate);

unitRouter.get("/", authorize(["owner", "manager", "surveyor"]), getAllUnits);

unitRouter.get(
  "/:propertyId/unit/:unitId",
  authorize(["owner", "manager", "surveyor"]),
  getUnitById
);

unitRouter.patch(
  "/:propertyId/unit/:unitId",
  authorize(["owner", "manager"]),
  validate(updateUnitSchema),
  updateUnit
);

unitRouter.delete(
  "/:propertyId/unit/:unitId",
  authorize(["owner", "manager"]),
  deleteUnit
);

export default unitRouter;
