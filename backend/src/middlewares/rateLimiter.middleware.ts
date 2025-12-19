import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  max?: number; // Max requests per window
  message?: string;
  statusCode?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export const rateLimit = (options: RateLimitOptions = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100,
    message = "Too many requests, please try again later.",
    statusCode = 429,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    store[key].count++;

    const current = store[key].count;
    const remaining = Math.max(0, max - current);
    const resetTime = new Date(store[key].resetTime).toISOString();

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", max.toString());
    res.setHeader("X-RateLimit-Remaining", remaining.toString());
    res.setHeader("X-RateLimit-Reset", resetTime);

    if (current > max) {
      res.setHeader(
        "Retry-After",
        Math.ceil((store[key].resetTime - now) / 1000).toString()
      );

      res.status(statusCode).json({
        success: false,
        message,
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
      });
      return;
    }

    // Handle skip options
    if (skipSuccessfulRequests || skipFailedRequests) {
      const originalSend = res.json.bind(res);
      res.json = function (data: any) {
        const shouldSkip =
          (skipSuccessfulRequests && res.statusCode < 400) ||
          (skipFailedRequests && res.statusCode >= 400);

        if (shouldSkip && store[key]) {
          store[key].count = Math.max(0, store[key].count - 1);
        }

        return originalSend(data);
      };
    }

    next();
  };
};

// Preset configurations
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 5 requests per 15 minutes
  message:
    "Too many authentication attempts, please try again after 15 minutes.",
  skipSuccessfulRequests: true,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: "Too many requests, please slow down.",
});
