import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller";
import {
  authenticate,
  optionalAuthenticate,
} from "../middlewares/auth.middleware";
import { authLimiter } from "../middlewares/rateLimiter.middleware";
import { validate } from "../utils/validate";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const authRouter: Router = Router();

// Public routes with rate limiting
authRouter.post("/register", authLimiter, validate(registerSchema), register);
authRouter.post("/login", authLimiter, validate(loginSchema), login);
authRouter.post("/refresh", refreshToken);

// Protected routes
authRouter.post("/logout", optionalAuthenticate, logout);
authRouter.get("/profile", authenticate, getProfile);

export default authRouter;
