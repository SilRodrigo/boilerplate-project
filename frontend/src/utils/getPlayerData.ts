export const getPlayerData = () => {
    const stored = localStorage.getItem("playerData");
    if (!stored) return null;

    return JSON.parse(stored);
}