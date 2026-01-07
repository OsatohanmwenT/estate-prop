"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
const drizzle_orm_1 = require("drizzle-orm");
const error_middleware_1 = require("../middlewares/error.middleware");
const ACCESS_TIME = "15m";
const REFRESH_TIME = "7d";
class AuthService {
    authConfig = {
        accessTokenExpiry: ACCESS_TIME,
        refreshTokenExpiry: REFRESH_TIME,
    };
    async generateToken(userId) {
        const refreshToken = jsonwebtoken_1.default.sign({ userId }, config_1.config.refreshTokenSecret, {
            expiresIn: REFRESH_TIME,
        });
        const refreshTokenHash = crypto_1.default
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");
        const refreshTokenExpiry = this.calculateExpiry(this.authConfig.refreshTokenExpiry);
        const accessTokenExpiry = this.calculateExpiry(this.authConfig.accessTokenExpiry);
        await this.storeRefreshToken({
            userId,
            refreshTokenHash,
            expiresAt: refreshTokenExpiry,
        });
        const accessToken = jsonwebtoken_1.default.sign({ userId }, config_1.config.jwtSecret, {
            expiresIn: ACCESS_TIME,
        });
        return {
            accessToken,
            refreshToken,
            expiresAt: accessTokenExpiry,
            refreshExpiresAt: refreshTokenExpiry,
        };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const payload = jsonwebtoken_1.default.verify(refreshToken, config_1.config.refreshTokenSecret);
            const userId = payload.userId;
            if (!userId)
                throw (0, error_middleware_1.createError)("Invalid token payload", 401);
            const [userSession] = await database_1.db
                .select()
                .from(schemas_1.sessions)
                .where((0, drizzle_orm_1.eq)(schemas_1.sessions.userId, userId));
            if (!userSession ||
                !userSession.refreshTokenHash ||
                !userSession.expiresAt) {
                throw (0, error_middleware_1.createError)("Refresh token not found", 401);
            }
            const incomingTokenHash = crypto_1.default
                .createHash("sha256")
                .update(refreshToken)
                .digest("hex");
            const storedHash = userSession.refreshTokenHash;
            if (incomingTokenHash.length !== storedHash.length) {
                await this.revokeRefreshToken(userId);
                throw (0, error_middleware_1.createError)("Invalid refresh token", 401);
            }
            const isMatch = crypto_1.default.timingSafeEqual(Buffer.from(incomingTokenHash, "hex"), Buffer.from(storedHash, "hex"));
            if (!isMatch) {
                await this.revokeRefreshToken(userId);
                throw (0, error_middleware_1.createError)("Invalid refresh token", 401);
            }
            const isExpired = new Date() > userSession.expiresAt;
            if (isExpired) {
                await this.revokeRefreshToken(userId);
                throw (0, error_middleware_1.createError)("Refresh token expired", 401);
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId }, config_1.config.jwtSecret, {
                expiresIn: ACCESS_TIME,
            });
            const accessTokenExpiry = this.calculateExpiry(this.authConfig.accessTokenExpiry);
            const newRefreshToken = jsonwebtoken_1.default.sign({ userId }, config_1.config.refreshTokenSecret, {
                expiresIn: REFRESH_TIME,
            });
            const newRefreshTokenHash = crypto_1.default
                .createHash("sha256")
                .update(newRefreshToken)
                .digest("hex");
            const newRefreshExpiry = this.calculateExpiry(this.authConfig.refreshTokenExpiry);
            await database_1.db
                .update(schemas_1.sessions)
                .set({
                refreshTokenHash: newRefreshTokenHash,
                expiresAt: newRefreshExpiry,
            })
                .where((0, drizzle_orm_1.eq)(schemas_1.sessions.userId, userId));
            return {
                accessToken,
                refreshToken: newRefreshToken,
                expiresAt: accessTokenExpiry,
                refreshExpiresAt: newRefreshExpiry,
            };
        }
        catch (error) {
            if (error.statusCode) {
                throw error;
            }
            throw (0, error_middleware_1.createError)("Invalid or expired refresh token", 401);
        }
    }
    async revokeRefreshToken(userId) {
        await database_1.db.delete(schemas_1.sessions).where((0, drizzle_orm_1.eq)(schemas_1.sessions.userId, userId));
    }
    calculateExpiry(expiryString) {
        const now = new Date();
        const result = new Date(now.getTime());
        if (expiryString.endsWith("m")) {
            result.setMinutes(result.getMinutes() + parseInt(expiryString));
        }
        else if (expiryString.endsWith("h")) {
            result.setHours(result.getHours() + parseInt(expiryString));
        }
        else if (expiryString.endsWith("d")) {
            result.setDate(result.getDate() + parseInt(expiryString));
        }
        return result;
    }
    async getUserSessions(userId) {
        return await database_1.db
            .select()
            .from(schemas_1.sessions)
            .where((0, drizzle_orm_1.eq)(schemas_1.sessions.userId, userId))
            .orderBy(schemas_1.sessions.createdAt);
    }
    async storeRefreshToken({ userId, refreshTokenHash, expiresAt, }) {
        await database_1.db.delete(schemas_1.sessions).where((0, drizzle_orm_1.eq)(schemas_1.sessions.userId, userId));
        await database_1.db.insert(schemas_1.sessions).values({
            userId,
            refreshTokenHash,
            expiresAt,
        });
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map