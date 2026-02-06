import { IPlayer } from "./player";

export interface IGameState {
    players: IPlayer[];
};

export const gameStateFactory = (): IGameState => {
    const gameState: IGameState = {
        players: [],
    };

    return gameState;
};
