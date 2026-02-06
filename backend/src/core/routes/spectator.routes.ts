import { makeInvoker } from "awilix-express";
import { Router } from "express";
import spectatorJoinControllerFactory from "../modules/spectator/join/controller";

const spectatorRoutes = Router();
const spectatorJoinController = makeInvoker(spectatorJoinControllerFactory);

spectatorRoutes.route('/join')
    .post(spectatorJoinController('handle'))

export { spectatorRoutes }