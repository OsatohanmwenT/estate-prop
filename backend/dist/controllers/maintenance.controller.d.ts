import { Request, Response } from "express";
export declare const createMaintenanceRequest: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMaintenanceRequests: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMaintenanceRequestById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateMaintenanceRequest: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteMaintenanceRequest: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const addComment: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMaintenanceLogs: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMaintenanceStatistics: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMaintenanceByProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMaintenanceByUnit: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const addReceipt: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getPendingReminders: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const markReminderSent: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=maintenance.controller.d.ts.map