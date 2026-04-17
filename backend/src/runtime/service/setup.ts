import { CATALOG, GameId } from "../../fixtures";
import { ELDRITCH_ID } from "../../fixtures/eldritch";
import { MANSIONS_OF_MADNESS_ID } from "../../fixtures/mansions-of-madness";
import { gameManager } from "../state/gameManager";



function startGameStates() {
    const initialGameIds: GameId[] = [ELDRITCH_ID, MANSIONS_OF_MADNESS_ID];

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