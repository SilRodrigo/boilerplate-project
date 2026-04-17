import YahooMarketDataRepository, { IMarketQuote } from "../../../repositories/implementations/external/YahooMarketDataRepository";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";

interface IFactoryParams {
    externalYahooMarketDataRepository: YahooMarketDataRepository;
}

export interface IMarketQuoteUseCase extends IUseCase<string, IMarketQuote> { }

export default function marketQuoteUseCaseFactory({
    externalYahooMarketDataRepository
}: IFactoryParams): IMarketQuoteUseCase {
    return {
        execute: async (ticker) => {
            const quote = await externalYahooMarketDataRepository.getQuote(ticker);

            return withUseCaseResponse(quote, "Market quote retrieved successfully.");
        }
    };
}
