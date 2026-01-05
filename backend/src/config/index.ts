import dotenv from "dotenv";

dotenv.config();

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Please check your .env file.`
    );
  }
  return value;
}

export const config = {
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
