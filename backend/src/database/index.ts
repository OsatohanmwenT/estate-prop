import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import { config } from "../config";
import * as schema from "./schemas";
import { drizzle } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { logger } from "../utils/logger";

neonConfig.webSocketConstructor = WebSocket;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, {
  schema,
});

pool.on("connect", () => {
  logger.info("Database connected successfully");
});

pool.on("error", (err: any) => {
  logger.error("Unexpected database error", err);
});

neonConfig.useSecureWebSocket = true;
neonConfig.wsProxy = (host) => `${host}:443/v1`;

neonConfig.fetchEndpoint = (host) => {
  const protocol = host === "localhost" ? "http" : "https";
  return `${protocol}://${host}/sql`;
};

const connection = neon(config.databaseUrl, {
  fetchOptions: {
    cache: "no-store",
  },
});

export const directDb = drizzleHttp(connection, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
