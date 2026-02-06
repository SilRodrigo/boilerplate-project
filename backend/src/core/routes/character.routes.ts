import { makeInvoker } from "awilix-express";
import { Router } from "express";
import characterFindByIdControllerFactory from "../modules/character/findById/controller";
import characterListControllerFactory from "../modules/character/list/controller";

const characterRoutes = Router();

const characterFindByIdController = makeInvoker(characterFindByIdControllerFactory);
const characterListController = makeInvoker(characterListControllerFactory);

characterRoutes.route('/:gameId')
    .get(characterListController('handle'))
characterRoutes.route('/:gameId/:id')
    .get(characterFindByIdController('handle'))

export { characterRoutes }
