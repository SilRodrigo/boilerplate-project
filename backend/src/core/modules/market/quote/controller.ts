import { Response } from "express";
import { errorResponse, successResponse } from "../../../../helpers/response";
import { IController } from "../../../../types/Controller";
import { IMarketQuote } from "../../../repositories/implementations/external/YahooMarketDataRepository";
import { IMarketQuoteUseCase } from "./useCase";

interface IFactoryParams {
    marketQuoteUseCase: IMarketQuoteUseCase;
}

export interface IMarketQuoteController extends IController<IMarketQuote> { }

export default function marketQuoteControllerFactory({
    marketQuoteUseCase
}: IFactoryParams): IMarketQuoteController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { ticker } = request.params;

            try {
                const { data, message } = await marketQuoteUseCase.execute(ticker);

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
