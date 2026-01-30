import { itemCatalog } from "@/data/items";


export function getItemById(gameId: string, id: string): any {
    const items = itemCatalog[gameId];

    return items.find(item => item.id === id);
}

export function getAllItems(gameId: string) {
    return itemCatalog[gameId];
}