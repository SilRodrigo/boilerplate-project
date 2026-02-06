import { makeInvoker } from "awilix-express";
import { Router } from "express";
import playerJoinControllerFactory from "../modules/player/join/controller";

const playerRoutes = Router();

const playerJoinController = makeInvoker(playerJoinControllerFactory);

playerRoutes.route('/join')
    .post(playerJoinController('handle'))

export { playerRoutes }