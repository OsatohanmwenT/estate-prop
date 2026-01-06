import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    systemRole: "admin" | "user";
    role?: "owner" | "manager" | "surveyor" | "agent" | "staff" | null;
    organizationId?: string | null;
    organizationName?: string | null;
    organizationSlug?: string | null;
    createdAt: Date;
  };
}

export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

      const user = await userService.findUserById(decoded.userId);
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
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  }
);

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check organization role (not systemRole)
    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    return next();
  };
};

export const optionalAuthenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = extractToken(req);

    if (!token) {
      // No token, continue without user
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

      const user = await userService.findUserById(decoded.userId);
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
    } catch (error) {
      // Token invalid or expired, continue without user
      console.log("Optional auth: Invalid token, continuing anyway");
    }

    return next();
  }
);

export const protect = (roles: string[] = []) => {
  return [authenticate, ...(roles.length > 0 ? [authorize(roles)] : [])];
};

function extractToken(req: Request): string | null {
  // Try to get token from cookie first
  const cookieToken = req.cookies?.access_token;
  if (cookieToken) {
    return cookieToken;
  }

  // Fallback to Authorization header for backwards compatibility
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}
