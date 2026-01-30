import { createContext, useContext } from "react";

type GameContextType = {
  state: any;
  updateField: (
    playerId: string,
    fieldKey: string,
    delta: number
  ) => void;
};

export const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }
  return context;
}
