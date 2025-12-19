import { Router } from "express";
import {
  createOrganization,
  getMyOrganization,
} from "../controllers/organization.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(authenticate);

router.post("/", createOrganization);
router.get("/my-organization", getMyOrganization);

export default router;
