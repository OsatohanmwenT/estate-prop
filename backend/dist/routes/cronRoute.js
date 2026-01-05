"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lib_1 = require("../utils/lib");
const config_1 = require("../config");
const cron_controller_1 = require("../controllers/cron.controller");
const cronRouter = (0, express_1.Router)();
cronRouter.post("/run-jobs", cron_controller_1.runJobs);
cronRouter.post("/schedule", cron_controller_1.runScheduledJobs);
cronRouter.post("/trigger", cron_controller_1.triggerJob);
cronRouter.get("/schedules", cron_controller_1.getSchedules);
cronRouter.delete("/schedule/:scheduleId", cron_controller_1.deleteSchedule);
cronRouter.post("/schedule/:scheduleId/pause", cron_controller_1.pauseSchedule);
cronRouter.post("/schedule/:scheduleId/resume", cron_controller_1.resumeSchedule);
cronRouter.post("/trigger-now", async (req, res) => {
    try {
        const result = await lib_1.qstash.publishJSON({
            url: `${config_1.config.baseUrl}/api/v1/cron/run-jobs`,
            body: { manual: true },
        });
        res.json({
            success: true,
            message: "Jobs triggered manually",
            messageId: result.messageId,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = cronRouter;
//# sourceMappingURL=cronRoute.js.map