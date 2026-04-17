import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { ICharacter } from "../../../entities/character";
import { GameId } from "../../../../fixtures";
import InMemoryCharacterRepository from "../../../repositories/implementations/inMemory/CharacterRepository";

interface IFactoryParams { 
    inMemoryCharacterRepository: InMemoryCharacterRepository;
}

export interface ICharacterListUseCase extends IUseCase<
    { gameId: GameId },
    ICharacter[]
> { }

export default function characterListUseCaseFactory({ 
    inMemoryCharacterRepository
}: IFactoryParams): ICharacterListUseCase {
    return {
        execute: async ({ gameId }) => {
            const result = inMemoryCharacterRepository.findAll({ gameId });

            return withUseCaseResponse(result, "Characters retrieved successfully.");
        }
    };
}
