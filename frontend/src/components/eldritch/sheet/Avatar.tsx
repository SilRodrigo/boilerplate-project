import { cn } from "@/lib/utils";

type Props = {
  characterId: string;
  imagePath: string
  containerClassName?: string
};

export default function Avatar({
  characterId,
  imagePath,
  containerClassName,
}: Props) {
  return (
    <div className={cn(
      'place-self-center md:place-self-start w-40 rounded-lg bg-black/30 border border-[var(--border)]',
      containerClassName
    )}>
      {characterId ? (
        <img
          src={imagePath}
          alt={characterId}
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
