import { Request, Response } from "express";
export declare const createInvoice: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getInvoiceById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getAllInvoices: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateInvoice: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const recordPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteInvoice: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getInvoicesByLease: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getOverdueInvoices: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUpcomingInvoices: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const generateRecurringInvoice: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getInvoiceStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=invoice.controller.d.ts.map