import type { GameId } from "@/data/catalog";
import Avatar from "./sheet/Avatar";
import Field from "./sheet/Field";

type PlayerCardProps = {
  player: any;
  isAdmin: boolean;
  gameId: GameId;
};

export default function Sheet({ player, isAdmin, gameId }: PlayerCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg shadow-black/30">

      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 sheet-background"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="
    relative
    z-10
    p-4
    space-y-4
    border border-[var(--border)]
    rounded-xl
  ">
        <div className="
      rounded-xl
      bg-[var(--card)]
      border border-[var(--border)]
      shadow-lg shadow-black/30
      p-5
      space-y-4
      hover:border-[var(--primary)]
    ">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <h3
              className="text-lg tracking-wide font-title"
            >
              {player.name}
            </h3>

            {isAdmin && (
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                admin
              </span>
            )}
          </div>

          <div className="md:grid grid-cols-2 items-start space-x-4 space-y-2">
            <Avatar
              gameId={gameId}
              characterId={player.characterId}
            />

            <div className="space-y-2 col grow">
              {player.fields.map((field: any) => (
                <Field
                  key={field.key}
                  field={field}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
