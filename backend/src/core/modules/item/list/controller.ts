import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IItemListUseCase } from './useCase';
import { GameId } from '../../../../fixtures';
import { IItem } from '../../../entities/item';

interface IFactoryParams {
    itemListUseCase: IItemListUseCase;
}

export interface IItemListController extends IController<{ items: IItem[] }> { }

export default function itemListControllerFactory({
    itemListUseCase
}: IFactoryParams): IItemListController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            try {
                const { gameId } = request.params;

                const { data, message } = await itemListUseCase.execute({ gameId: gameId as GameId });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
