import { CATALOG, GameId } from "../../../fixtures";

export default class InMemoryCharacterRepository {
    findById({ id, gameId }: { id: string, gameId: GameId }) {
        return CATALOG[gameId]?.characters.find(c => c.id === id);
    }
}
