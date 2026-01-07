import { NextFunction, Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        fullName: string;
        email: string;
        phone?: string;
        systemRole: "admin" | "user";
        role?: "owner" | "manager" | "surveyor" | "agent" | "staff" | null;
        organizationId?: string | null;
        organizationName?: string | null;
        organizationSlug?: string | null;
        createdAt: Date;
    };
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
export declare const authorize: (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const optionalAuthenticate: (req: Request, res: Response, next: NextFunction) => void;
export declare const protect: (roles?: string[]) => ((req: Request, res: Response, next: NextFunction) => void)[];
export {};
//# sourceMappingURL=auth.middleware.d.ts.map