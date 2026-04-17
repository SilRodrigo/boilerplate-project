import { Response } from "express";
import { errorResponse, successResponse } from "../../../../helpers/response";
import { IController } from "../../../../types/Controller";
import { IFundDocument } from "../../../repositories/implementations/external/CvmFundDocumentsRepository";
import { IFundDocumentsUseCase } from "./useCase";

interface IFactoryParams {
    fundDocumentsUseCase: IFundDocumentsUseCase;
}

export interface IFundDocumentsController extends IController<IFundDocument[]> { }

export default function fundDocumentsControllerFactory({
    fundDocumentsUseCase
}: IFactoryParams): IFundDocumentsController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { ticker } = request.params;
            const month = String(request.query.month || "2026-03");

            try {
                const { data, message } = await fundDocumentsUseCase.execute({ ticker, month });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
