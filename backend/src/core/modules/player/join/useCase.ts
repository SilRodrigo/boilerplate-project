import { tokenService } from "../../../../runtime/service/token";
import { gameManager } from "../../../../runtime/state/gameManager";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { GameId } from "../../../../fixtures";
import InMemoryCharacterRepository from "../../../repositories/implementations/inMemory/CharacterRepository";

interface IFactoryParams {
    inMemoryCharacterRepository: InMemoryCharacterRepository;
}

export interface IPlayerJoinUseCase extends IUseCase<
    {
        characterId: string
        playerName: string
        gameId: GameId
    },
    { token: string }
> { }

export default function playerJoinUseCaseFactory({
    inMemoryCharacterRepository
}: IFactoryParams): IPlayerJoinUseCase {
    return {
        execute: async ({ characterId, playerName, gameId }) => {
            const character = inMemoryCharacterRepository.findById({ id: characterId, gameId });

            if (!character) {
                throw new Error("Character not found.");
            }

            const token = tokenService.createToken(gameId, characterId);

            gameManager.addPlayer(gameId, {
                token,
                name: playerName,
                character
            });

            return withUseCaseResponse({ token }, "Player added successfully.");
        }
    };
}
