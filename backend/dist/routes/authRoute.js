"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rateLimiter_middleware_1 = require("../middlewares/rateLimiter.middleware");
const validate_1 = require("../utils/validate");
const auth_validation_1 = require("../validations/auth.validation");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", rateLimiter_middleware_1.authLimiter, (0, validate_1.validate)(auth_validation_1.registerSchema), auth_controller_1.register);
authRouter.post("/login", rateLimiter_middleware_1.authLimiter, (0, validate_1.validate)(auth_validation_1.loginSchema), auth_controller_1.login);
authRouter.post("/refresh", auth_controller_1.refreshToken);
authRouter.post("/logout", auth_middleware_1.optionalAuthenticate, auth_controller_1.logout);
authRouter.get("/profile", auth_middleware_1.authenticate, auth_controller_1.getProfile);
exports.default = authRouter;
//# sourceMappingURL=authRoute.js.map