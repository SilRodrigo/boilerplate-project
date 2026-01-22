import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IExample } from '../../../entities/example';
import { IExampleUpdateUseCase } from './useCase';

interface IFactoryParams {
    exampleUpdateUseCase: IExampleUpdateUseCase;
}

export interface IExampleUpdateController extends IController<IExample> { }

export default function exampleUpdateControllerFactory({
    exampleUpdateUseCase
}: IFactoryParams): IExampleUpdateController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { id } = request.params;
            const { name, description } = request.body;

            try {
                const { data, message } = await exampleUpdateUseCase.execute({
                    id,
                    name,
                    description,
                });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
