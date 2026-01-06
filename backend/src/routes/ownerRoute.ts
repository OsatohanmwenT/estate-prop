import { Router } from "express";
import {
  createOwner,
  deleteOwner,
  getAllOwners,
  getOwnerById,
  updateOwner,
} from "../controllers/owner.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../utils/validate";
import {
  createOwnerSchema,
  updateOwnerSchema,
} from "../validations/owner.validation";

const ownerRouter: Router = Router();

ownerRouter.use(authenticate);

ownerRouter.post(
  "/",
  authorize(["owner", "manager"]),
  validate(createOwnerSchema),
  createOwner
);

ownerRouter.get("/", getAllOwners);
ownerRouter.get("/:id", getOwnerById);
ownerRouter.put(
  "/:id",
  authorize(["owner", "manager"]),
  validate(updateOwnerSchema),
  updateOwner
);
ownerRouter.delete("/:id", authorize(["owner", "manager"]), deleteOwner);

export default ownerRouter;
