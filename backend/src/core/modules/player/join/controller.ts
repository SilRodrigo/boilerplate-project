import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { GameId } from '../../../fixtures';
import { IPlayerJoinUseCase } from './useCase';

interface IFactoryParams {
    playerJoinUseCase: IPlayerJoinUseCase;
}

export interface IPlayerJoinController extends IController<any> { }

export default function playerJoinControllerFactory({
    playerJoinUseCase
}: IFactoryParams): IPlayerJoinController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            try {
                const { gameId, characterId, playerName } = request.body;
                const { data, message } = await playerJoinUseCase.execute({ characterId, playerName, gameId: gameId as GameId });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
