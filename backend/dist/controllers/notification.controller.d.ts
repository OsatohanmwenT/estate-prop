import { Request, Response } from "express";
export declare const sendPaymentReminder: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const sendOverdueReminder: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const sendBulkOverdueReminders: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getNotificationHistory: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const retryNotification: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const markAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const markAllAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUnreadCount: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=notification.controller.d.ts.map