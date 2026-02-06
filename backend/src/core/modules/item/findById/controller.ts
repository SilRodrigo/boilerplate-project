import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IItemFindByIdUseCase } from './useCase';
import { GameId } from '../../../fixtures';
import { IItem } from '../../../entities/item';

interface IFactoryParams {
    itemFindByIdUseCase: IItemFindByIdUseCase;
}

export interface IItemFindByIdController extends IController<IItem> { }

export default function itemFindByIdControllerFactory({
    itemFindByIdUseCase
}: IFactoryParams): IItemFindByIdController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { id, gameId } = request.params;

            try {
                const { data, message } = await itemFindByIdUseCase.execute({ id, gameId: gameId as GameId });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
