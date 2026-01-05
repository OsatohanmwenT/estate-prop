"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organization_controller_1 = require("../controllers/organization.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post("/", organization_controller_1.createOrganization);
router.get("/my-organization", organization_controller_1.getMyOrganization);
router.patch("/:id", organization_controller_1.updateOrganization);
router.get("/:id/members", organization_controller_1.getMembers);
router.post("/:id/members/invite", organization_controller_1.inviteMember);
router.patch("/members/:memberId", organization_controller_1.updateMember);
router.delete("/members/:memberId", organization_controller_1.removeMember);
exports.default = router;
//# sourceMappingURL=organizationRoute.js.map