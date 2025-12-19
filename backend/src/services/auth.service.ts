import jwt from "jsonwebtoken";
import { config } from "../config";
import crypto from "crypto";
import { db } from "../database";
import { sessions } from "../database/schemas";
import { eq } from "drizzle-orm";
import { createError } from "../middlewares/error.middleware";

const ACCESS_TIME = "15m";
const REFRESH_TIME = "7d";

interface authConfig {
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

class AuthService {
  private authConfig: authConfig = {
    accessTokenExpiry: ACCESS_TIME,
    refreshTokenExpiry: REFRESH_TIME,
  };

  async generateToken(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    refreshExpiresAt: Date;
  }> {
    const refreshToken = jwt.sign({ userId }, config.refreshTokenSecret, {
      expiresIn: REFRESH_TIME,
    });
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const refreshTokenExpiry = this.calculateExpiry(
      this.authConfig.refreshTokenExpiry
    );
    const accessTokenExpiry = this.calculateExpiry(
      this.authConfig.accessTokenExpiry
    );

    await this.storeRefreshToken({
      userId,
      refreshTokenHash,
      expiresAt: refreshTokenExpiry,
    });

    const accessToken = jwt.sign({ userId }, config.jwtSecret, {
      expiresIn: ACCESS_TIME,
    });

    return {
      accessToken,
      refreshToken,
      expiresAt: accessTokenExpiry,
      refreshExpiresAt: refreshTokenExpiry,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    refreshExpiresAt: Date;
  }> {
    try {
      const payload = jwt.verify(refreshToken, config.refreshTokenSecret) as {
        userId: string;
        iat?: number;
        exp?: number;
      };

      const userId = payload.userId;
      if (!userId) throw createError("Invalid token payload", 401);

      const [userSession] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.userId, userId));

      if (
        !userSession ||
        !userSession.refreshTokenHash ||
        !userSession.expiresAt
      ) {
        throw createError("Refresh token not found", 401);
      }

      const incomingTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const storedHash = userSession.refreshTokenHash;
      if (incomingTokenHash.length !== storedHash.length) {
        await this.revokeRefreshToken(userId);
        throw createError("Invalid refresh token", 401);
      }

      const isMatch = crypto.timingSafeEqual(
        Buffer.from(incomingTokenHash, "hex"),
        Buffer.from(storedHash, "hex")
      );

      if (!isMatch) {
        await this.revokeRefreshToken(userId);
        throw createError("Invalid refresh token", 401);
      }

      const isExpired = new Date() > userSession.expiresAt;
      if (isExpired) {
        await this.revokeRefreshToken(userId);
        throw createError("Refresh token expired", 401);
      }

      const accessToken = jwt.sign({ userId }, config.jwtSecret, {
        expiresIn: ACCESS_TIME,
      });

      const accessTokenExpiry = this.calculateExpiry(
        this.authConfig.accessTokenExpiry
      );

      const newRefreshToken = jwt.sign({ userId }, config.refreshTokenSecret, {
        expiresIn: REFRESH_TIME,
      });
      const newRefreshTokenHash = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");
      const newRefreshExpiry = this.calculateExpiry(
        this.authConfig.refreshTokenExpiry
      );

      await db
        .update(sessions)
        .set({
          refreshTokenHash: newRefreshTokenHash,
          expiresAt: newRefreshExpiry,
        })
        .where(eq(sessions.userId, userId));

      return {
        accessToken,
        refreshToken: newRefreshToken,
        expiresAt: accessTokenExpiry,
        refreshExpiresAt: newRefreshExpiry,
      };
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw createError("Invalid or expired refresh token", 401);
    }
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }

  private calculateExpiry(expiryString: string): Date {
    const now = new Date();
    const result = new Date(now.getTime());
    if (expiryString.endsWith("m")) {
      result.setMinutes(result.getMinutes() + parseInt(expiryString));
    } else if (expiryString.endsWith("h")) {
      result.setHours(result.getHours() + parseInt(expiryString));
    } else if (expiryString.endsWith("d")) {
      result.setDate(result.getDate() + parseInt(expiryString));
    }
    return result;
  }

  async getUserSessions(userId: string) {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(sessions.createdAt);
  }

  private async storeRefreshToken({
    userId,
    refreshTokenHash,
    expiresAt,
  }: {
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
  }) {
    // Delete existing sessions for this user before creating a new one
    // This ensures only one active session per user
    await db.delete(sessions).where(eq(sessions.userId, userId));

    await db.insert(sessions).values({
      userId,
      refreshTokenHash,
      expiresAt,
    });
  }
}

export const authService = new AuthService();
