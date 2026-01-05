"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const database_1 = require("./database");
const error_middleware_1 = require("./middlewares/error.middleware");
const rateLimiter_middleware_1 = require("./middlewares/rateLimiter.middleware");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const cronRoute_1 = __importDefault(require("./routes/cronRoute"));
const dashboardRoute_1 = __importDefault(require("./routes/dashboardRoute"));
const documentRoute_1 = __importDefault(require("./routes/documentRoute"));
const invoiceRoute_1 = __importDefault(require("./routes/invoiceRoute"));
const leaseRoute_1 = __importDefault(require("./routes/leaseRoute"));
const notificationRoute_1 = __importDefault(require("./routes/notificationRoute"));
const organizationRoute_1 = __importDefault(require("./routes/organizationRoute"));
const ownerRoute_1 = __importDefault(require("./routes/ownerRoute"));
const propertyRoute_1 = __importDefault(require("./routes/propertyRoute"));
const tenantRoute_1 = __importDefault(require("./routes/tenantRoute"));
const unitRoute_1 = __importDefault(require("./routes/unitRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.config.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/api", rateLimiter_middleware_1.apiLimiter);
app.use("/api/v1/auth", authRoute_1.default);
app.use("/api/v1/dashboard", dashboardRoute_1.default);
app.use("/api/v1/notifications", notificationRoute_1.default);
app.use("/api/v1/organizations", organizationRoute_1.default);
app.use("/api/v1/properties", propertyRoute_1.default);
app.use("/api/v1/units", unitRoute_1.default);
app.use("/api/v1/owners", ownerRoute_1.default);
app.use("/api/v1/tenants", tenantRoute_1.default);
app.use("/api/v1/leases", leaseRoute_1.default);
app.use("/api/v1/invoices", invoiceRoute_1.default);
app.use("/api/v1/documents", documentRoute_1.default);
app.use("/api/v1/cron", cronRoute_1.default);
app.get("/", (req, res) => {
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
        },
    });
});
app.get("/health", async (req, res) => {
    try {
        await database_1.pool.query("SELECT 1");
        res.status(200).json({
            success: true,
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: "connected",
        });
    }
    catch (error) {
        res.status(503).json({
            success: false,
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            database: "disconnected",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`⏰ Scheduled jobs managed via QStash: POST /api/v1/cron/schedule`);
});
//# sourceMappingURL=index.js.map