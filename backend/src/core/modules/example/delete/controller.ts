import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IExampleDeleteUseCase } from './useCase';

interface IFactoryParams {
    exampleDeleteUseCase: IExampleDeleteUseCase;
}

export interface IExampleDeleteController extends IController<void> { }

export default function exampleDeleteControllerFactory({
    exampleDeleteUseCase
}: IFactoryParams): IExampleDeleteController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { id } = request.params;

            try {
                const { message } = await exampleDeleteUseCase.execute(id);

                return successResponse(response, null, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
