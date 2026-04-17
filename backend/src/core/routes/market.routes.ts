import { makeInvoker } from "awilix-express";
import { Router } from "express";
import marketChartControllerFactory from "../modules/market/chart/controller";
import marketQuoteControllerFactory from "../modules/market/quote/controller";

const marketRoutes = Router();

const marketChartController = makeInvoker(marketChartControllerFactory);
const marketQuoteController = makeInvoker(marketQuoteControllerFactory);

marketRoutes.route("/quote/:ticker")
    .get(marketQuoteController("handle"));

marketRoutes.route("/chart/:ticker")
    .get(marketChartController("handle"));

export { marketRoutes }
