import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { CATALOG, GameId } from "../../../../fixtures";
import { IItem } from "../../../entities/item";

interface IFactoryParams { }

export interface IItemListUseCase extends IUseCase<
    { gameId: GameId },
    IItem[]
> { }

export default function itemListUseCaseFactory({ }: IFactoryParams): IItemListUseCase {
    return {
        execute: async ({ gameId }) => {
            const result = CATALOG[gameId].items;

            return withUseCaseResponse(result, "Items retrieved successfully.");
        }
    };
}
