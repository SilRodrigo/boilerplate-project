import type { GameId } from "@/data/catalog";
import { characterCatalog } from "@/data/characters";

export function getCharacter(
    gameId: GameId,
    characterId?: string
) {
    if (!characterId) return undefined;

    return characterCatalog[gameId]?.find(
        (c: { id: string }) => c.id === characterId
    );
}
