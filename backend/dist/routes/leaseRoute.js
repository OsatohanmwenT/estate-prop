"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lease_controller_1 = require("../controllers/lease.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_1 = require("../utils/validate");
const lease_validation_1 = require("../validations/lease.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post("/", (0, validate_1.validate)(lease_validation_1.createLeaseSchema), lease_controller_1.createLease);
router.get("/", lease_controller_1.getAllLeases);
router.get("/stats", lease_controller_1.getLeaseStats);
router.get("/:leaseId", lease_controller_1.getLeaseById);
router.put("/:leaseId", (0, validate_1.validate)(lease_validation_1.updateLeaseSchema), lease_controller_1.updateLease);
router.patch("/:leaseId/terminate", lease_controller_1.terminateLease);
router.get("/tenant/:tenantId", lease_controller_1.getActiveLeasesByTenant);
router.get("/unit/:unitId", lease_controller_1.getLeaseByUnit);
exports.default = router;
//# sourceMappingURL=leaseRoute.js.map