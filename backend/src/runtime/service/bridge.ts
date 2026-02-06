import { HOST_APP, PORT_APP } from "../../core/config";
import { IItem } from "../../core/entities/item";
import { GameId } from "../../core/fixtures";
import { PREFIX_ROUTE } from "../../core/url";
import { ApiResponse } from "../../types/ApiResponse";

const API_BASE_URL = `${HOST_APP}:${PORT_APP}${PREFIX_ROUTE}`;

async function findItemById({ gameId, id }: { gameId: GameId; id: string }) {
    try {
        const response = await fetch(`${API_BASE_URL}/item/${gameId}/${id}`) as Response & ApiResponse<{ data: IItem }>;
        const { data } = await response.json();

        return data;
    } catch (error) {
        return null;
    }
}

async function getItemList({ gameId }: { gameId: GameId }) {
    try {
        const response = await fetch(`${API_BASE_URL}/item/list/${gameId}`) as Response & ApiResponse<{ data: IItem[] }>;
        const { data } = await response.json();

        return data;
    } catch (error) {
        return null;
    }
}

export const bridgeService = {
    findItemById,
    getItemList,
};