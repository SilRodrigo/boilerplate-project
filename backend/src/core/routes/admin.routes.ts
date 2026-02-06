import { makeInvoker } from "awilix-express";
import { Router } from "express";
import adminJoinControllerFactory from "../modules/admin/join/controller";

const adminRoutes = Router();

const adminJoinController = makeInvoker(adminJoinControllerFactory);

adminRoutes.route('/join')
    .post(adminJoinController('handle'))

export { adminRoutes }
