import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export const createError = (
  message: string,
  statusCode: number = 500
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = 500, message } = error;

  console.error("Error:", {
    message,
    statusCode,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
