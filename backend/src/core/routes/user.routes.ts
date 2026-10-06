import { makeInvoker } from "awilix-express";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import userAuthControllerFactory from "../modules/user/auth/controller";
import userMeControllerFactory from "../modules/user/me/controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { AUTH_RATE_LIMIT_MAX } from "../config";

const userRoutes = Router();

const userAuthController = makeInvoker(userAuthControllerFactory);
const userMeController = makeInvoker(userMeControllerFactory);

// Stricter limit on login to slow down brute force. Successful logins are not counted.
const authRateLimit = rateLimit({
    windowMs: 15 * 60_000,
    limit: AUTH_RATE_LIMIT_MAX,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { data: null, message: 'Too many login attempts, please try again later.' },
});

userRoutes.post('/auth', authRateLimit, userAuthController('handle'));
userRoutes.get('/me', authMiddleware, userMeController('handle'));

export { userRoutes }
