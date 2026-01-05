"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJobs = exports.deleteSchedule = exports.resumeSchedule = exports.pauseSchedule = exports.getSchedules = exports.triggerJob = exports.runScheduledJobs = void 0;
const express_1 = require("@upstash/workflow/express");
const config_1 = require("../config");
const generateRecurringInvoices_1 = require("../jobs/generateRecurringInvoices");
const sendOverdueReminders_1 = require("../jobs/sendOverdueReminders");
const sendRentDueReminders_1 = require("../jobs/sendRentDueReminders");
const updateExpiredLeases_1 = require("../jobs/updateExpiredLeases");
const updateOverdueInvoices_1 = require("../jobs/updateOverdueInvoices");
const asyncHandler_1 = require("../utils/asyncHandler");
const lib_1 = require("../utils/lib");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.runScheduledJobs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existingSchedules = await lib_1.qstash.schedules.list();
    const dailyJobSchedule = existingSchedules.find((s) => s.destination === `${config_1.config.baseUrl}/api/v1/cron/run-jobs`);
    if (dailyJobSchedule) {
        return res.json({
            success: true,
            message: "Daily schedule already exists",
            scheduleId: dailyJobSchedule.scheduleId,
            cron: dailyJobSchedule.cron,
            nextRun: "Every day at 2:00 AM UTC",
        });
    }
    const schedule = await lib_1.qstash.schedules.create({
        destination: `${config_1.config.baseUrl}/api/v1/cron/run-jobs`,
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
});
exports.triggerJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const baseUrl = config_1.config.baseUrl;
        const result = await lib_1.qstash.publishJSON({
            url: `${baseUrl}/api/v1/cron/run-jobs`,
            body: req.body,
        });
        res.json({
            success: true,
            message: "Workflow triggered",
            messageId: result.messageId,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSchedules = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const schedules = await lib_1.qstash.schedules.list();
        res.json({ success: true, schedules });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.pauseSchedule = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { scheduleId } = req.params;
    try {
        await lib_1.qstash.schedules.pause({ schedule: scheduleId });
        res.json({ success: true, message: "Schedule paused" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.resumeSchedule = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { scheduleId } = req.params;
    try {
        await lib_1.qstash.schedules.resume({ schedule: scheduleId });
        res.json({ success: true, message: "Schedule resumed" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteSchedule = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        await lib_1.qstash.schedules.delete(req.params.scheduleId);
        res.json({ success: true, message: "Schedule deleted" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.runJobs = (0, express_1.serve)(async (context) => {
    console.log("🚀 Starting scheduled job workflow...");
    const invoiceResult = await context.run("generate-invoices", async () => {
        console.log("🔄 Generating recurring invoices...");
        return await (0, generateRecurringInvoices_1.generateRecurringInvoices)();
    });
    const overdueResult = await context.run("update-overdue", async () => {
        console.log("🔄 Updating overdue invoices...");
        return await (0, updateOverdueInvoices_1.updateOverdueInvoices)();
    });
    const expiredResult = await context.run("update-expired", async () => {
        console.log("🔄 Updating expired leases...");
        return await (0, updateExpiredLeases_1.updateExpiredLeases)();
    });
    const rentRemindersResult = await context.run("rent-reminders", async () => {
        console.log("🔄 Sending rent due reminders...");
        return await (0, sendRentDueReminders_1.sendRentDueReminders)();
    });
    const overdueRemindersResult = await context.run("overdue-reminders", async () => {
        console.log("🔄 Sending overdue reminders...");
        return await (0, sendOverdueReminders_1.sendOverdueReminders)();
    });
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
//# sourceMappingURL=cron.controller.js.map