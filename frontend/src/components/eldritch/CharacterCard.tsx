import type { ICharacter } from "@/data/characters";
import Avatar from "./sheet/Avatar";
import type { GameId } from "@/data/catalog";
import Field from "./sheet/Field";
import { useEffect, useState } from "react";

export function CharacterCard({
  character,
  gameId,
  delta,
  playerName,
}: {
  character: ICharacter;
  gameId: GameId;
  playerName?: string;
  delta?: number;
}) {

  //-------

  const [animate, setAnimate] = useState<"up" | "down" | null>(null)

  useEffect(() => {
    if (!delta) return

    setAnimate(delta > 0 ? "up" : "down")

    const t = setTimeout(() => setAnimate(null), 500)
    return () => clearTimeout(t)
  }, [delta])

  //-------

  return (
    <div
      className={`
    relative rounded-xl overflow-hidden
    transition-all duration-300
    ${animate === "up" ? "scale-101 ring-2 ring-green-500 hue-rotate-[90deg]" : ""}
    ${animate === "down" ? "shake ring-2 ring-red-500 hue-rotate-[33deg]" : ""}
  `}
    >
      <div className="relative rounded-xl overflow-hidden shadow-lg shadow-black/30">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 sheet-background"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 p-4 space-y-4 border border-[var(--border)] rounded-xl">
          <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-lg shadow-black/30 p-5 space-y-4hover:border-[var(--primary)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h3 className="text-lg tracking-wide font-title">
                {character.name} {playerName && `(${playerName})`}
              </h3>
            </div>

            <div className="md:grid grid-cols-2 items-start space-x-4 space-y-2">
              <div className="flex flex-col items-center space-y-4 pr-2">
                <Avatar
                  gameId={gameId}
                  characterId={character.id}
                />
                <div className="mt-2 italic text-sm">"{character.quote}"</div>
                <div className="italic text-sm">{character.bio}</div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {character.fields.slice(0, 2).map(field => (
                    <Field key={field.key} field={field} />
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-2">
                  {character.fields.slice(2, 7).map(field => (
                    <Field key={field.key} field={field} labelClassName="text-xs" />
                  ))}
                </div>

                <div className="grid grid-cols-1">
                  {character.fields.slice(7, 8).map(field => (
                    <Field key={field.key} field={field} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
