import { api, type ApiResponse } from ".";

export function joinGame(
    gameId: string,
    playerName: string,
    characterId: string
): Promise<ApiResponse<{ token: string }>> {
    if (!gameId) throw new Error("gameId is required");
    if (!playerName) throw new Error("playerName is required");
    if (!characterId) throw new Error("characterId is required");

    const { request } = api();

    return request(`/player/join`, {
        method: 'POST',
        body: JSON.stringify({
            playerName,
            characterId,
            gameId
        }),
    });
}

export function joinAdminGame(
    gameId: string,
): Promise<ApiResponse<{ token: string }>> {
    if (!gameId) throw new Error("gameId is required");

    const { request } = api();

    return request(`/admin/join`, {
        method: 'POST',
        body: JSON.stringify({
            gameId
        }),
    });
}

export function joinSpectatorGame(
    gameId: string,
): Promise<ApiResponse<{ token: string }>> {
    if (!gameId) throw new Error("gameId is required");

    const { request } = api();

    return request(`/spectator/join`, {
        method: 'POST',
        body: JSON.stringify({ gameId }),
    });
}