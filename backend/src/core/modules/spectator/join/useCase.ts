import { tokenService } from "../../../../runtime/service/token";
import { gameManager } from "../../../../runtime/state/gameManager";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { ISpectator } from "../../../entities/spectator";
import { GameId } from "../../../fixtures";

interface IFactoryParams { }

export interface ISpectatorJoinUseCase extends IUseCase<{ gameId: GameId }, { token: string }> { }

export default function spectatorJoinUseCaseFactory({ }: IFactoryParams): ISpectatorJoinUseCase {
    return {
        execute: async ({ gameId }) => {
            const token = tokenService.createToken(gameId, "spectator");
            const spectator: ISpectator = { token }

            gameManager.addSpectator(gameId, spectator);

            return withUseCaseResponse({ token }, "Spectator added successfully.");
        }
    };
}
