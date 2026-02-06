import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { GameId } from '../../../fixtures';
import { ISpectatorJoinUseCase } from './useCase';

interface IFactoryParams {
    spectatorJoinUseCase: ISpectatorJoinUseCase;
}

export interface ISpectatorJoinController extends IController<{ token: string }> { }

export default function spectatorJoinControllerFactory({
    spectatorJoinUseCase
}: IFactoryParams): ISpectatorJoinController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            try {
                const { gameId } = request.body;
                const { data, message } = await spectatorJoinUseCase.execute({ gameId: gameId as GameId });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
