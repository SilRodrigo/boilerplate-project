import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IExample } from '../../../entities/example';
import { IExampleFindByIdUseCase } from './useCase';

interface IFactoryParams {
    exampleFindByIdUseCase: IExampleFindByIdUseCase;
}

export interface IExampleFindByIdController extends IController<IExample> { }

export default function exampleFindByIdControllerFactory({
    exampleFindByIdUseCase
}: IFactoryParams): IExampleFindByIdController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { id } = request.params;

            try {
                const { data, message } = await exampleFindByIdUseCase.execute(id);

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
