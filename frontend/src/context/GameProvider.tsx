import { GameContext } from "./GameContext";
import { useGameSocket } from "@/hooks/useGameSocket";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { state, updateField } = useGameSocket();

  if (!state) {
    return <div>conectando...</div>;
  }

  return (
    <GameContext.Provider value={{ state, updateField }}>
      {children}
    </GameContext.Provider>
  );
}
