"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tenant_controller_1 = require("../controllers/tenant.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_1 = require("../utils/validate");
const tenant_validation_1 = require("../validations/tenant.validation");
const tenantRouter = (0, express_1.Router)();
tenantRouter.use(auth_middleware_1.authenticate);
tenantRouter.get("/", (0, auth_middleware_1.authorize)(["owner", "manager", "surveyor"]), tenant_controller_1.getAllTenants);
tenantRouter.get("/:id", (0, auth_middleware_1.authorize)(["owner", "manager", "surveyor"]), tenant_controller_1.getTenantById);
tenantRouter.post("/", (0, auth_middleware_1.authorize)(["owner", "manager"]), (0, validate_1.validate)(tenant_validation_1.createTenantSchema), tenant_controller_1.createTenant);
tenantRouter.put("/:id", (0, auth_middleware_1.authorize)(["owner", "manager"]), (0, validate_1.validate)(tenant_validation_1.updateTenantSchema), tenant_controller_1.updateTenant);
tenantRouter.delete("/:id", (0, auth_middleware_1.authorize)(["owner", "manager"]), tenant_controller_1.deleteTenant);
exports.default = tenantRouter;
//# sourceMappingURL=tenantRoute.js.map