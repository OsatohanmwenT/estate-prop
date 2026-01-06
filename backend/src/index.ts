import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import { config } from "./config";
import { pool } from "./database";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import { apiLimiter } from "./middlewares/rateLimiter.middleware";
import authRouter from "./routes/authRoute";
import cronRouter from "./routes/cronRoute";
import dashboardRouter from "./routes/dashboardRoute";
import documentRouter from "./routes/documentRoute";
import invoiceRouter from "./routes/invoiceRoute";
import leaseRouter from "./routes/leaseRoute";
import maintenanceRouter from "./routes/maintenanceRoute";
import notificationRouter from "./routes/notificationRoute";
import organizationRouter from "./routes/organizationRoute";
import ownerRouter from "./routes/ownerRoute";
import propertyRouter from "./routes/propertyRoute";
import tenantRouter from "./routes/tenantRoute";
import unitRouter from "./routes/unitRoute";
// import jobScheduler from "./services/job.scheduler"; // Using QStash instead

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

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
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/units", unitRouter);
app.use("/api/v1/owners", ownerRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/leases", leaseRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/documents", documentRouter);
app.use("/api/v1/maintenance", maintenanceRouter);
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
      documents: "/api/v1/documents",
      maintenance: "/api/v1/maintenance",
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
  console.log(
    `⏰ Scheduled jobs managed via QStash: POST /api/v1/cron/schedule`
  );
  // jobScheduler.initializeJobs(); // Using QStash instead - call POST /api/v1/cron/schedule to enable
});
