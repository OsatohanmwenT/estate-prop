"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { fullName, email, phone, password } = req.body;
    const newUser = await user_service_1.userService.createUser({
        fullName,
        email,
        password,
        phone,
    });
    const fullUserData = await user_service_1.userService.findUserById(newUser.id);
    const tokens = await auth_service_1.authService.generateToken(newUser.id);
    const isProduction = process.env.NODE_ENV === "production";
    console.log("isProduction:", isProduction);
    res.cookie("access_token", tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 30 * 60 * 1000,
        path: "/",
    });
    res.cookie("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user: fullUserData,
        },
    });
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_service_1.userService.authenticateUser({ email, password });
    const tokens = await auth_service_1.authService.generateToken(user.id);
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("access_token", tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
        path: "/",
    });
    res.cookie("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user,
        },
    });
});
exports.refreshToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    const isProduction = process.env.NODE_ENV === "production";
    if (!refreshToken) {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        });
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        });
        return res.status(401).json({
            success: false,
            message: "Refresh token not found",
        });
    }
    try {
        const tokens = await auth_service_1.authService.refreshAccessToken(refreshToken);
        res.cookie("access_token", tokens.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
            path: "/",
        });
        res.cookie("refresh_token", tokens.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
        });
    }
    catch (error) {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        });
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        });
        throw error;
    }
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (userId) {
        try {
            await auth_service_1.authService.revokeRefreshToken(userId);
        }
        catch (error) {
            console.error("Error revoking refresh token:", error);
        }
    }
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });
    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});
exports.getProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: { user },
    });
});
//# sourceMappingURL=auth.controller.js.map