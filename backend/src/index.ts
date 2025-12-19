import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import propertyRouter from "./routes/propertyRoute";
import authRouter from "./routes/authRoute";
import ownerRouter from "./routes/ownerRoute";
import unitRouter from "./routes/unitRoute";
import tenantRouter from "./routes/tenantRoute";
import leaseRouter from "./routes/leaseRoute";
import invoiceRouter from "./routes/invoiceRoute";
import dashboardRouter from "./routes/dashboardRoute";
import organizationRouter from "./routes/organizationRoute";
import express, { Request, Response } from "express";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import jobScheduler from "./services/job.scheduler";
import helmet from "helmet";
import cronRouter from "./routes/cronRoute";
import { config } from "./config";
import { pool } from "./database";
import { apiLimiter } from "./middlewares/rateLimiter.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/units", unitRouter);
app.use("/api/v1/owners", ownerRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/leases", leaseRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/cron", cronRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to the estate management automation tool",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      dashboard: "/api/v1/dashboard",
      properties: "/api/v1/properties",
      units: "/api/v1/units",
      owners: "/api/v1/owners",
      tenants: "/api/v1/tenants",
      leases: "/api/v1/leases",
      invoices: "/api/v1/invoices",
    },
  });
});

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  try {
    // Check database connection
    await pool.query("SELECT 1");

    res.status(200).json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  jobScheduler.initializeJobs();
});
