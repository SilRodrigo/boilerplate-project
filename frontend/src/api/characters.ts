import type { GameId } from "@/data/catalog";
import type { ICharacter } from "@/data/characters";
import { api } from "@/api";

export async function getCharacter(
    gameId: GameId,
    characterId?: string
): Promise<ICharacter[]> {
    if (!gameId) throw new Error("gameId is required");

    const { request } = api();
    const { data } = await request(`/character/${gameId}/${characterId || ''}`);

    return data as ICharacter[];
}
