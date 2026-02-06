import { tokenService } from "../../../../runtime/service/token";
import { gameManager } from "../../../../runtime/state/gameManager";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { GameId } from "../../../fixtures";
import InMemoryCharacterRepository from "../../../repositories/implementations/inMemory/CharacterRepository";

interface IFactoryParams {
    inMemoryCharacterRepository: InMemoryCharacterRepository;
}

export interface IAdminJoinUseCase extends IUseCase<
    {
        gameId: GameId
    },
    { token: string }
> { }

export default function adminJoinUseCaseFactory({
    inMemoryCharacterRepository
}: IFactoryParams): IAdminJoinUseCase {
    return {
        execute: async ({ gameId }) => {
            const token = tokenService.createToken(gameId, "admin");
            gameManager.addAdminToken(gameId, token);

            return withUseCaseResponse({ token }, "Admin added successfully.");
        }
    };
}
