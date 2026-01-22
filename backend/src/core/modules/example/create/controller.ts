import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IExample } from '../../../entities/example';
import { IExampleCreateUseCase } from './useCase';

interface IFactoryParams {
    exampleCreateUseCase: IExampleCreateUseCase;
}

export interface IExampleCreateController extends IController<IExample> { }

export default function exampleCreateControllerFactory({
    exampleCreateUseCase
}: IFactoryParams): IExampleCreateController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { name, description } = request.body;

            try {
                const { data, message } = await exampleCreateUseCase.execute({ 
                    name, 
                    description
                });

                return successResponse(response, data, message, 201);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
