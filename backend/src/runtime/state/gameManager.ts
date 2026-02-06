import { IPlayer } from "../../core/entities/player";
import { ISpectator } from "../../core/entities/spectator";
import { GameState } from "./gameState";

const gameManagerMap = new Map<string, GameState>();

export interface IGameManager {
    get(gameId: string): GameState | undefined;
    set(gameId: string, state: GameState): void;
    delete(gameId: string): void;
    addAdminToken(gameId: string, token: string): void;
    addSpectator(gameId: string, spectator: ISpectator): void;
    addPlayer(gameId: string, player: IPlayer): void;
    kickPlayer(gameId: string, playerToken: string): void;
    isAdminToken(gameId: string, token: string): boolean;
}

export const gameManager = {
    get: (gameId: string): GameState | undefined => {
        return gameManagerMap.get(gameId);
    },

    set: (gameId: string, state: GameState): void => {
        gameManagerMap.set(gameId, state);
    },

    delete: (gameId: string): void => {
        gameManagerMap.delete(gameId);
    },

    addAdminToken: (gameId: string, token: string): void => {
        const state = gameManagerMap.get(gameId);

        if (state) state.adminToken = token;
    },

    addPlayer: (gameId: string, player: IPlayer): void => {
        const state = gameManagerMap.get(gameId);

        if (state) state.players.push(player);
    },

    addSpectator: (gameId: string, spectator: ISpectator): void => {
        const state = gameManagerMap.get(gameId);

        if (state) state.spectators.push(spectator);
    },

    kickPlayer: (gameId: string, playerToken: string): void => {
        const state = gameManagerMap.get(gameId);

        if (state) state.players = state.players.filter(p => p.token !== playerToken);
    },

    isAdminToken: (gameId: string, token: string): boolean => {
        const state = gameManagerMap.get(gameId);

        return state ? state.adminToken === token : false;
    },
}