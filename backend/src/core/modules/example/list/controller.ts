import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IExampleListUseCase } from './useCase';
import { parseListParams } from '../../../../helpers/parseListParams';

interface IFactoryParams {
    exampleListUseCase: IExampleListUseCase;
}

export interface IExampleListController extends IController<any> { }

export default function exampleListControllerFactory({
    exampleListUseCase
}: IFactoryParams): IExampleListController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            try {
                const { currentPage, pageSize, filter, order } = parseListParams(request.query);

                const { data, message } = await exampleListUseCase.execute({
                    currentPage,
                    pageSize,
                    filter,
                    order,
                });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
