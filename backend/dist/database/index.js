"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.directDb = exports.db = exports.pool = void 0;
const serverless_1 = require("@neondatabase/serverless");
const config_1 = require("../config");
const schema = __importStar(require("./schemas"));
const neon_serverless_1 = require("drizzle-orm/neon-serverless");
const neon_http_1 = require("drizzle-orm/neon-http");
const logger_1 = require("../utils/logger");
serverless_1.neonConfig.webSocketConstructor = WebSocket;
exports.pool = new serverless_1.Pool({
    connectionString: config_1.config.databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});
exports.db = (0, neon_serverless_1.drizzle)(exports.pool, {
    schema,
});
exports.pool.on("connect", () => {
    logger_1.logger.info("Database connected successfully");
});
exports.pool.on("error", (err) => {
    logger_1.logger.error("Unexpected database error", err);
});
serverless_1.neonConfig.useSecureWebSocket = true;
serverless_1.neonConfig.wsProxy = (host) => `${host}:443/v1`;
serverless_1.neonConfig.fetchEndpoint = (host) => {
    const protocol = host === "localhost" ? "http" : "https";
    return `${protocol}://${host}/sql`;
};
const connection = (0, serverless_1.neon)(config_1.config.databaseUrl, {
    fetchOptions: {
        cache: "no-store",
    },
});
exports.directDb = (0, neon_http_1.drizzle)(connection, {
    schema,
    logger: process.env.NODE_ENV === "development",
});
//# sourceMappingURL=index.js.map