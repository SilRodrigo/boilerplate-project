import { makeInvoker } from "awilix-express";
import { Router } from "express";
import exampleCreateControllerFactory from "../modules/example/create/controller";
import exampleDeleteControllerFactory from "../modules/example/delete/controller";
import exampleFindByIdControllerFactory from "../modules/example/findById/controller";
import exampleListControllerFactory from "../modules/example/list/controller";
import exampleUpdateControllerFactory from "../modules/example/update/controller";

const exampleRoutes = Router();

const exampleCreateController = makeInvoker(exampleCreateControllerFactory);
const exampleDeleteController = makeInvoker(exampleDeleteControllerFactory);
const exampleFindByIdController = makeInvoker(exampleFindByIdControllerFactory);
const exampleListController = makeInvoker(exampleListControllerFactory);
const exampleUpdateController = makeInvoker(exampleUpdateControllerFactory);

exampleRoutes.route('/')
    .get(exampleListController('handle'))
    .post(exampleCreateController('handle'));

exampleRoutes.route('/:id')
    .get(exampleFindByIdController('handle'))
    .put(exampleUpdateController('handle'))
    .delete(exampleDeleteController('handle'));

export { exampleRoutes }
