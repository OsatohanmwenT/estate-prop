import { Request, Response, NextFunction } from "express";
interface RateLimitOptions {
    windowMs?: number;
    max?: number;
    message?: string;
    statusCode?: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
export declare const rateLimit: (options?: RateLimitOptions) => (req: Request, res: Response, next: NextFunction) => void;
export declare const authLimiter: (req: Request, res: Response, next: NextFunction) => void;
export declare const apiLimiter: (req: Request, res: Response, next: NextFunction) => void;
export declare const strictLimiter: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=rateLimiter.middleware.d.ts.map