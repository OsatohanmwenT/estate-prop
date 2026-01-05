import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
export declare const validate: (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map