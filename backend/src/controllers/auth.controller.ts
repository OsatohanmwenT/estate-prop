import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, password } = req.body;
  const newUser = await userService.createUser({
    fullName,
    email,
    password,
    phone,
  });

  const fullUserData = await userService.findUserById(newUser.id);

  const tokens = await authService.generateToken(newUser.id);

  // Set httpOnly cookies
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("access_token", tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
  });

  res.cookie("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userService.authenticateUser({ email, password });

  const tokens = await authService.generateToken(user.id);

  // Set httpOnly cookies
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("access_token", tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
  });

  res.cookie("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;

    const isProduction = process.env.NODE_ENV === "production";

    if (!refreshToken) {
      // Clear any stale cookies
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
      const tokens = await authService.refreshAccessToken(refreshToken);

      // Set new httpOnly cookies with rotated tokens
      res.cookie("access_token", tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: "/",
      });

      res.cookie("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      // If refresh fails, clear the stale cookies
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

      throw error; // Let the error middleware handle it
    }
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (userId) {
    // Only revoke token if user is authenticated
    try {
      await authService.revokeRefreshToken(userId);
    } catch (error) {
      console.error("Error revoking refresh token:", error);
      // Continue with logout even if revoking fails
    }
  }

  // Clear httpOnly cookies with the same options used when setting them
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

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

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
