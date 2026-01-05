import { serve } from "@upstash/workflow/express";
import { Request, Response } from "express";
import { config } from "../config";
import { generateRecurringInvoices } from "../jobs/generateRecurringInvoices";
import { sendOverdueReminders } from "../jobs/sendOverdueReminders";
import { sendRentDueReminders } from "../jobs/sendRentDueReminders";
import { updateExpiredLeases } from "../jobs/updateExpiredLeases";
import { updateOverdueInvoices } from "../jobs/updateOverdueInvoices";
import { asyncHandler } from "../utils/asyncHandler";
import { qstash } from "../utils/lib";

import dotenv from "dotenv";
dotenv.config();

export const runScheduledJobs = asyncHandler(
  async (req: Request, res: Response) => {
    const existingSchedules = await qstash.schedules.list();
    const dailyJobSchedule = existingSchedules.find(
      (s) => s.destination === `${config.baseUrl}/api/v1/cron/run-jobs`
    );

    if (dailyJobSchedule) {
      return res.json({
        success: true,
        message: "Daily schedule already exists",
        scheduleId: dailyJobSchedule.scheduleId,
        cron: dailyJobSchedule.cron,
        nextRun: "Every day at 2:00 AM UTC",
      });
    }

    const schedule = await qstash.schedules.create({
      destination: `${config.baseUrl}/api/v1/cron/run-jobs`,
      cron: "0 2 * * *",
      retries: 5,
      method: "POST",
    });

    res.json({
      success: true,
      message: "Daily schedule created successfully!",
      scheduleId: schedule.scheduleId,
      cron: "0 2 * * *",
      nextRun: "Every day at 2:00 AM UTC",
      jobs: [
        "Generate recurring invoices (with prepayment detection)",
        "Update overdue invoices",
        "Update expired leases",
        "Send rent due reminders",
        "Send overdue reminders",
      ],
    });
  }
);

export const triggerJob = asyncHandler(async (req: Request, res: Response) => {
  try {
    const baseUrl = config.baseUrl;

    const result = await qstash.publishJSON({
      url: `${baseUrl}/api/v1/cron/run-jobs`,
      body: req.body,
    });

    res.json({
      success: true,
      message: "Workflow triggered",
      messageId: result.messageId,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const getSchedules = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const schedules = await qstash.schedules.list();
      res.json({ success: true, schedules });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const pauseSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    try {
      await qstash.schedules.pause({ schedule: scheduleId });
      res.json({ success: true, message: "Schedule paused" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const resumeSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    try {
      await qstash.schedules.resume({ schedule: scheduleId });
      res.json({ success: true, message: "Schedule resumed" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const deleteSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      await qstash.schedules.delete(req.params.scheduleId);
      res.json({ success: true, message: "Schedule deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const runJobs = serve(async (context) => {
  console.log("🚀 Starting scheduled job workflow...");

  const invoiceResult = await context.run("generate-invoices", async () => {
    console.log("🔄 Generating recurring invoices...");
    return await generateRecurringInvoices();
  });

  const overdueResult = await context.run("update-overdue", async () => {
    console.log("🔄 Updating overdue invoices...");
    return await updateOverdueInvoices();
  });

  const expiredResult = await context.run("update-expired", async () => {
    console.log("🔄 Updating expired leases...");
    return await updateExpiredLeases();
  });

  const rentRemindersResult = await context.run("rent-reminders", async () => {
    console.log("🔄 Sending rent due reminders...");
    return await sendRentDueReminders();
  });

  const overdueRemindersResult = await context.run(
    "overdue-reminders",
    async () => {
      console.log("🔄 Sending overdue reminders...");
      return await sendOverdueReminders();
    }
  );

  console.log("✅ All scheduled jobs completed successfully!");

  return {
    success: true,
    timestamp: new Date().toISOString(),
    results: {
      invoices: invoiceResult,
      overdue: overdueResult,
      expired: expiredResult,
      rentReminders: rentRemindersResult,
      overdueReminders: overdueRemindersResult,
    },
  };
});
