import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { ICharacter } from "../../../entities/character";
import { CATALOG, GameId } from "../../../../fixtures";

interface IFactoryParams { }

export interface ICharacterListUseCase extends IUseCase<
    { gameId: GameId },
    ICharacter[]
> { }

export default function characterListUseCaseFactory({ }: IFactoryParams): ICharacterListUseCase {
    return {
        execute: async ({ gameId }) => {
            const result = CATALOG[gameId].characters;

            return withUseCaseResponse(result, "Characters retrieved successfully.");
        }
    };
}
