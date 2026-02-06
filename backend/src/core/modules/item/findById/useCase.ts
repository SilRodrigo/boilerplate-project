import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import InMemoryItemRepository from "../../../repositories/implementations/inMemory/ItemRepository";
import { GameId } from "../../../fixtures";
import { IItem } from "../../../entities/item";

interface IFactoryParams {
    inMemoryItemRepository: InMemoryItemRepository;
}

export interface IItemFindByIdUseCase extends IUseCase<{ id: string, gameId: GameId }, IItem> { }

export default function itemFindByIdUseCaseFactory({
    inMemoryItemRepository
}: IFactoryParams): IItemFindByIdUseCase {
    return {
        execute: async ({ id, gameId }) => {
            const item = inMemoryItemRepository.findById({ id, gameId });
            if (!item) {
                throw new Error("Item not found.");
            }

            return withUseCaseResponse(item, "Item retrieved successfully.");
        }
    };
}
