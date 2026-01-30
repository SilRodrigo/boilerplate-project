import { config } from "@/data/config";
import type { GameId } from "@/data/catalog";

export function getConfig(
    gameId: GameId
) {
    return config[gameId];
}
