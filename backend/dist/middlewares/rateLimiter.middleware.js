"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictLimiter = exports.apiLimiter = exports.authLimiter = exports.rateLimit = void 0;
const store = {};
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    });
}, 5 * 60 * 1000);
const rateLimit = (options = {}) => {
    const { windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests, please try again later.", statusCode = 429, skipSuccessfulRequests = false, skipFailedRequests = false, } = options;
    return (req, res, next) => {
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
        res.setHeader("X-RateLimit-Limit", max.toString());
        res.setHeader("X-RateLimit-Remaining", remaining.toString());
        res.setHeader("X-RateLimit-Reset", resetTime);
        if (current > max) {
            res.setHeader("Retry-After", Math.ceil((store[key].resetTime - now) / 1000).toString());
            res.status(statusCode).json({
                success: false,
                message,
                retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
            });
            return;
        }
        if (skipSuccessfulRequests || skipFailedRequests) {
            const originalSend = res.json.bind(res);
            res.json = function (data) {
                const shouldSkip = (skipSuccessfulRequests && res.statusCode < 400) ||
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
exports.rateLimit = rateLimit;
exports.authLimiter = (0, exports.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many authentication attempts, please try again after 15 minutes.",
    skipSuccessfulRequests: true,
});
exports.apiLimiter = (0, exports.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
exports.strictLimiter = (0, exports.rateLimit)({
    windowMs: 60 * 1000,
    max: 10,
    message: "Too many requests, please slow down.",
});
//# sourceMappingURL=rateLimiter.middleware.js.map