import YahooMarketDataRepository, {
    IMarketChartPoint,
    MarketInterval
} from "../../../repositories/implementations/external/YahooMarketDataRepository";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";

export interface IMarketChartParams {
    ticker: string;
    period1: Date;
    period2: Date;
    interval?: MarketInterval;
}

interface IFactoryParams {
    externalYahooMarketDataRepository: YahooMarketDataRepository;
}

export interface IMarketChartUseCase extends IUseCase<IMarketChartParams, IMarketChartPoint[]> { }

export default function marketChartUseCaseFactory({
    externalYahooMarketDataRepository
}: IFactoryParams): IMarketChartUseCase {
    return {
        execute: async ({ ticker, period1, period2, interval }) => {
            const chart = await externalYahooMarketDataRepository.getChart(ticker, period1, period2, interval);

            return withUseCaseResponse(chart, "Market chart retrieved successfully.");
        }
    };
}
