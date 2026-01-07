"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = exports.optionalAuthenticate = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const user_service_1 = require("../services/user.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.authenticate = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await user_service_1.userService.findUserById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        req.user = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            systemRole: user.systemRole,
            createdAt: user.createdAt,
            phone: user.phone || undefined,
            role: user.role || undefined,
            organizationId: user.organizationId || undefined,
            organizationName: user.organizationName || undefined,
            organizationSlug: user.organizationSlug || undefined,
        };
        return next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
});
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        if (!req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Insufficient permissions",
            });
        }
        return next();
    };
};
exports.authorize = authorize;
exports.optionalAuthenticate = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await user_service_1.userService.findUserById(decoded.userId);
        if (user) {
            req.user = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                systemRole: user.systemRole,
                createdAt: user.createdAt,
                phone: user.phone || undefined,
                role: user.role || undefined,
                organizationId: user.organizationId || undefined,
                organizationName: user.organizationName || undefined,
                organizationSlug: user.organizationSlug || undefined,
            };
        }
    }
    catch (error) {
        console.log("Optional auth: Invalid token, continuing anyway");
    }
    return next();
});
const protect = (roles = []) => {
    return [exports.authenticate, ...(roles.length > 0 ? [(0, exports.authorize)(roles)] : [])];
};
exports.protect = protect;
function extractToken(req) {
    const cookieToken = req.cookies?.access_token;
    if (cookieToken) {
        return cookieToken;
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }
    return null;
}
//# sourceMappingURL=auth.middleware.js.map