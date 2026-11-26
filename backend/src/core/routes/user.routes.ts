import { makeInvoker } from "awilix-express";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import userAuthControllerFactory from "../modules/user/auth/controller";
import userListControllerFactory from "../modules/user/list/controller";
import userMeControllerFactory from "../modules/user/me/controller";
import userRegisterControllerFactory from "../modules/user/register/controller";
import { adminMiddleware, authMiddleware } from "../../middlewares/authMiddleware";
import { AUTH_RATE_LIMIT_MAX, REGISTER_RATE_LIMIT_MAX } from "../config";

const userRoutes = Router();

const userAuthController = makeInvoker(userAuthControllerFactory);
const userListController = makeInvoker(userListControllerFactory);
const userMeController = makeInvoker(userMeControllerFactory);
const userRegisterController = makeInvoker(userRegisterControllerFactory);

// Stricter limit on login to slow down brute force. Successful logins are not counted.
const authRateLimit = rateLimit({
    windowMs: 15 * 60_000,
    limit: AUTH_RATE_LIMIT_MAX,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { data: null, message: 'Too many login attempts, please try again later.' },
});

// Every sign-up counts, successful or not, to slow down mass account creation.
const registerRateLimit = rateLimit({
    windowMs: 60 * 60_000,
    limit: REGISTER_RATE_LIMIT_MAX,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { data: null, message: 'Too many sign-ups, please try again later.' },
});

userRoutes.get('/', authMiddleware, adminMiddleware, userListController('handle'));
userRoutes.post('/auth', authRateLimit, userAuthController('handle'));
userRoutes.post('/register', registerRateLimit, userRegisterController('handle'));
userRoutes.get('/me', authMiddleware, userMeController('handle'));

export default userRoutes;
