"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const unit_controller_1 = require("../controllers/unit.controller");
const validate_1 = require("../utils/validate");
const unit_validation_1 = require("../validations/unit.validation");
const unitRouter = (0, express_1.Router)();
unitRouter.use(auth_middleware_1.authenticate);
unitRouter.get("/", (0, auth_middleware_1.authorize)(["owner", "manager", "surveyor"]), unit_controller_1.getAllUnits);
unitRouter.get("/:propertyId/unit/:unitId", (0, auth_middleware_1.authorize)(["owner", "manager", "surveyor"]), unit_controller_1.getUnitById);
unitRouter.patch("/:propertyId/unit/:unitId", (0, auth_middleware_1.authorize)(["owner", "manager"]), (0, validate_1.validate)(unit_validation_1.updateUnitSchema), unit_controller_1.updateUnit);
unitRouter.delete("/:propertyId/unit/:unitId", (0, auth_middleware_1.authorize)(["owner", "manager"]), unit_controller_1.deleteUnit);
exports.default = unitRouter;
//# sourceMappingURL=unitRoute.js.map