import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IAdminJoinUseCase } from './useCase';
import { GameId } from '../../../../fixtures';

interface IFactoryParams {
    adminJoinUseCase: IAdminJoinUseCase;
}

export interface IAdminJoinController extends IController<any> { }

export default function adminJoinControllerFactory({
    adminJoinUseCase
}: IFactoryParams): IAdminJoinController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            try {
                const { gameId } = request.body;
                const { data, message } = await adminJoinUseCase.execute({ gameId: gameId as GameId });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
