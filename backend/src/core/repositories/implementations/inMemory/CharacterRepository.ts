import { CATALOG, GameId } from "../../../../fixtures";

export default class InMemoryCharacterRepository {
    findById({ id, gameId }: { id: string, gameId: GameId }) {
        const character = CATALOG[gameId]?.characters.find(c => c.id === id);

        return structuredClone(character);
    }

    findAll({ gameId }: { gameId: GameId }) {
        const characters = CATALOG[gameId]?.characters || [];

        return structuredClone(characters);
    }
}
