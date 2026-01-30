import type { GameId } from "@/data/catalog";
import { getCharacter } from "@/utils/getCharacters";

type Props = {
  gameId: GameId;
  characterId?: string;
};

export default function Avatar({ gameId, characterId }: Props) {
  const character = getCharacter(gameId, characterId);

  return (
    <div className="
      place-self-center md:place-self-start
      w-40
      rounded-lg
      bg-black/30
      border border-[var(--border)]
    ">
      {character ? (
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs text-[var(--muted-text)]">
          sem personagem
        </span>
      )}
    </div>
  );
}
