import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { ICharacterListUseCase } from './useCase';
import { GameId } from '../../../../fixtures';

interface IFactoryParams { 
    characterListUseCase: ICharacterListUseCase;
}

export interface ICharacterListController extends IController<any> { }

export default function characterListControllerFactory({
    characterListUseCase
}: IFactoryParams): ICharacterListController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            try {
                const { gameId } = request.params;

                const { data, message } = await characterListUseCase.execute({ gameId: gameId as GameId });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
