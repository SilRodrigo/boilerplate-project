import { makeInvoker } from "awilix-express";
import { Router } from "express";
import itemFindByIdControllerFactory from "../modules/item/findById/controller";

const itemRoutes = Router();

const itemFindByIdController = makeInvoker(itemFindByIdControllerFactory);
    
itemRoutes.route('/:gameId/:id')
    .get(itemFindByIdController('handle'))

export { itemRoutes }