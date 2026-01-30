import type { GameId } from "@/data/catalog";
import { getConfig } from "./getConfig";

export function getBackground(
    gameId: GameId
) {
    return getConfig(gameId).background;
}
