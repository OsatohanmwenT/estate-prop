"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const owner_controller_1 = require("../controllers/owner.controller");
const validate_1 = require("../utils/validate");
const owner_validation_1 = require("../validations/owner.validation");
const ownerRouter = (0, express_1.Router)();
ownerRouter.use(auth_middleware_1.authenticate);
ownerRouter.post("/", (0, auth_middleware_1.authorize)(["owner", "manager"]), (0, validate_1.validate)(owner_validation_1.createOwnerSchema), owner_controller_1.createOwner);
ownerRouter.get("/", owner_controller_1.getAllOwners);
ownerRouter.get("/:id", owner_controller_1.getOwnerById);
ownerRouter.put("/:id", (0, auth_middleware_1.authorize)(["owner", "manager"]), (0, validate_1.validate)(owner_validation_1.updateOwnerSchema), owner_controller_1.updateOwner);
ownerRouter.delete("/:id", (0, auth_middleware_1.authorize)(["owner", "manager"]), owner_controller_1.deleteOwner);
exports.default = ownerRouter;
//# sourceMappingURL=ownerRoute.js.map