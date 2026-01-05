import { Request, Response } from "express";
export declare const runScheduledJobs: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const triggerJob: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getSchedules: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const pauseSchedule: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const resumeSchedule: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteSchedule: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const runJobs: import("express").Router;
//# sourceMappingURL=cron.controller.d.ts.map