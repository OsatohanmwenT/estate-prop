"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnvVar(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}. Please check your .env file.`);
    }
    return value;
}
exports.config = {
    databaseUrl: getEnvVar("DATABASE_URL"),
    jwtSecret: getEnvVar("JWT_SECRET"),
    refreshTokenSecret: getEnvVar("REFRESH_TOKEN"),
    qstash: {
        url: getEnvVar("QSTASH_URL"),
        token: getEnvVar("QSTASH_TOKEN"),
        currentSigningKey: getEnvVar("QSTASH_CURRENT_SIGNING_KEY"),
        nextSigningKey: getEnvVar("QSTASH_NEXT_SIGNING_KEY"),
    },
    email: {
        host: getEnvVar("EMAIL_HOST"),
        port: parseInt(getEnvVar("EMAIL_PORT")),
        user: getEnvVar("EMAIL_USER"),
        pass: getEnvVar("EMAIL_PASS"),
        from: getEnvVar("EMAIL_FROM"),
        secure: getEnvVar("EMAIL_SECURE"),
    },
    baseUrl: process.env.BASE_URL || "http://localhost:5000",
    corsOrigins: process.env.CORS_ORIGINS?.split(",") || [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://estate-prop.vercel.app",
    ],
};
//# sourceMappingURL=index.js.map