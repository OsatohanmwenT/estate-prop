import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller";
import { validate } from "../utils/validate";
import {
  createPropertySchema,
  updatePropertySchema,
} from "../validations/property.validation";
import { createUnit, getUnitsByProperty } from "../controllers/unit.controller";
import { createUnitSchema } from "../validations/unit.validation";

const propertyRouter: Router = Router();

propertyRouter.use(authenticate);

propertyRouter.get("/", getAllProperties);
propertyRouter.get("/:id", getPropertyById);
propertyRouter.post(
  "/",
  authorize(["owner", "manager"]),
  validate(createPropertySchema),
  createProperty
);
propertyRouter.put(
  "/:id",
  authorize(["owner", "manager"]),
  validate(updatePropertySchema),
  updateProperty
);
propertyRouter.delete("/:id", authorize(["owner", "manager"]), deleteProperty);

propertyRouter.get("/:propertyId/units", getUnitsByProperty);

propertyRouter.post(
  "/:propertyId/units",
  authorize(["owner", "manager"]),
  validate(createUnitSchema),
  createUnit
);

export default propertyRouter;
