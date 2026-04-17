import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { ICharacter } from "../../../entities/character";
import { CATALOG, GameId } from "../../../../fixtures";
import InMemoryCharacterRepository from "../../../repositories/implementations/inMemory/CharacterRepository";

interface IFactoryParams {
    inMemoryCharacterRepository: InMemoryCharacterRepository;
}

export interface ICharacterFindByIdUseCase extends IUseCase<{ id: string, gameId: GameId }, ICharacter> { }

export default function characterFindByIdUseCaseFactory({
    inMemoryCharacterRepository
}: IFactoryParams): ICharacterFindByIdUseCase {
    return {
        execute: async ({ id, gameId }) => {
            const character = inMemoryCharacterRepository.findById({ id, gameId });
            if (!character) {
                throw new Error("Character not found.");
            }

            return withUseCaseResponse(character, "Character retrieved successfully.");
        }
    };
}
