import { IPlayer } from "../../core/entities/player";
import { CATALOG, GameId } from "../../core/fixtures";
import { gameManager } from "../state/gameManager";



function startGameStates() {
    const initialGameIds: GameId[] = ['eldritch'];

    initialGameIds.forEach((gameId) => {
        gameManager.set(gameId, {
            gameId,
            adminToken: '',
            players: [],
            spectators: []
        });

        CATALOG[gameId].setup();
    });
}

export const setupService = {
    run() {
        startGameStates();
    }
}