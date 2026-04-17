import { CATALOG, GameId } from "../../../../fixtures";

export default class InMemoryItemRepository {
    findById({ id, gameId }: { id: string, gameId: GameId }) {
        return CATALOG[gameId]?.items.find(c => c.id === id);
    }
}
