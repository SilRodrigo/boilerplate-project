import { makeInvoker } from "awilix-express";
import { Router } from "express";
import fundDocumentsControllerFactory from "../modules/fund/documents/controller";

const fundRoutes = Router();

const fundDocumentsController = makeInvoker(fundDocumentsControllerFactory);

fundRoutes.route("/:ticker/documents")
    .get(fundDocumentsController("handle"));

export { fundRoutes }
