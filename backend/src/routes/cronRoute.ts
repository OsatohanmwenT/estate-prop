import { Router } from "express";
import { qstash } from "../utils/lib";
import { config } from "../config";

import {
  deleteSchedule,
  getSchedules,
  pauseSchedule,
  resumeSchedule,
  runJobs,
  runScheduledJobs,
  triggerJob,
} from "../controllers/cron.controller";

const cronRouter: Router = Router();

cronRouter.post("/run-jobs", runJobs);

cronRouter.post("/schedule", runScheduledJobs);

cronRouter.post("/trigger", triggerJob);

cronRouter.get("/schedules", getSchedules);

cronRouter.delete("/schedule/:scheduleId", deleteSchedule);

cronRouter.post("/schedule/:scheduleId/pause", pauseSchedule);

cronRouter.post("/schedule/:scheduleId/resume", resumeSchedule);

cronRouter.post("/trigger-now", async (req, res) => {
  try {
    const result = await qstash.publishJSON({
      url: `${config.baseUrl}/api/v1/cron/run-jobs`,
      body: { manual: true },
    });

    res.json({
      success: true,
      message: "Jobs triggered manually",
      messageId: result.messageId,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default cronRouter;
