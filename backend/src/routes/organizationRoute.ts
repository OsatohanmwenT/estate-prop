import { Router } from "express";
import {
  createOrganization,
  getMyOrganization,
  updateOrganization,
  getMembers,
  inviteMember,
  updateMember,
  removeMember,
} from "../controllers/organization.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use(authenticate);

// Organization routes
router.post("/", createOrganization);
router.get("/my-organization", getMyOrganization);
router.patch("/:id", updateOrganization);

// Member routes
router.get("/:id/members", getMembers);
router.post("/:id/members/invite", inviteMember);
router.patch("/members/:memberId", updateMember);
router.delete("/members/:memberId", removeMember);

export default router;
