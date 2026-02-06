import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { ICharacter } from '../../../entities/character';
import { ICharacterFindByIdUseCase } from './useCase';
import { GameId } from '../../../fixtures';

interface IFactoryParams {
    characterFindByIdUseCase: ICharacterFindByIdUseCase;
}

export interface ICharacterFindByIdController extends IController<ICharacter> { }

export default function characterFindByIdControllerFactory({
    characterFindByIdUseCase
}: IFactoryParams): ICharacterFindByIdController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { id, gameId } = request.params;

            try {
                const { data, message } = await characterFindByIdUseCase.execute({ id, gameId: gameId as GameId });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
