import { GameId } from "../../core/fixtures";

export const tokenService = {
    createToken(gameId: string, playerId: string): string {
        return `${gameId}:${playerId}:${Math.random().toString(36).substr(2, 9)}`;
    },

    parseToken(token: string): { gameId: GameId; playerId: string } {
        try {
            const parts = token.split(":");
            if (parts.length < 3) throw new Error("Invalid token format.");
    
            return { gameId: parts[0] as GameId, playerId: parts[1] };
        } catch (error) {
            return { gameId: "" as GameId, playerId: "" };            
        }
    },
}