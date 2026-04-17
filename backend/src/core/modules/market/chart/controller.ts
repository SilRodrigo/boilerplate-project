import { Response } from "express";
import { errorResponse, successResponse } from "../../../../helpers/response";
import { IController } from "../../../../types/Controller";
import { IMarketChartPoint, MarketInterval } from "../../../repositories/implementations/external/YahooMarketDataRepository";
import { IMarketChartUseCase } from "./useCase";

interface IFactoryParams {
    marketChartUseCase: IMarketChartUseCase;
}

const marketIntervals = new Set(["1m", "2m", "5m", "15m", "30m", "60m", "1d", "1wk", "1mo"]);

export interface IMarketChartController extends IController<IMarketChartPoint[]> { }

export default function marketChartControllerFactory({
    marketChartUseCase
}: IFactoryParams): IMarketChartController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { ticker } = request.params;
            const { from, to, interval } = request.query;

            try {
                const period2 = to ? new Date(String(to)) : new Date();
                const period1 = from
                    ? new Date(String(from))
                    : new Date(period2.getTime() - 24 * 60 * 60 * 1000);
                const parsedInterval = String(interval || "5m");

                if (Number.isNaN(period1.getTime()) || Number.isNaN(period2.getTime())) {
                    throw new Error("Invalid chart period.");
                }

                if (!marketIntervals.has(parsedInterval)) {
                    throw new Error("Invalid chart interval.");
                }

                const { data, message } = await marketChartUseCase.execute({
                    ticker,
                    period1,
                    period2,
                    interval: parsedInterval as MarketInterval,
                });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
