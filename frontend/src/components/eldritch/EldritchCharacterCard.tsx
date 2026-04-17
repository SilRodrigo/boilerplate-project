import type { FieldType, ICharacter } from "@/data/characters";
import Avatar from "./sheet/Avatar";
import Field from "./sheet/Field";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

type FieldTypeMap = {
  [key: string]: FieldType;
};

export function EldritchCharacterCard({
  character,
  playerName,
}: {
  character: ICharacter;
  playerName?: string;
}) {
  const {
    quote,
    bio,
    action,
    passive,
    health,
    name,
    sanity,
    lore,
    influence,
    observation,
    strength,
    willpower,
    items,
  } = Object.fromEntries(character.fields.map(f => [f.key, f])) as FieldTypeMap;

  return (
    <div className={`relative rounded-xl overflow-hidden transition-all duration-300`}>
      <div className="relative rounded-xl overflow-hidden shadow-lg shadow-black/30">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 sheet-background"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 p-4 space-y-4 border border-[var(--border)] rounded-xl">
          <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-lg shadow-black/30 p-3 space-y-4hover:border-[var(--primary)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h3 className="text-lg tracking-wide font-title">
                {name.value as string} {playerName && `(${playerName})`}
              </h3>
            </div>

            {quote && bio && <Accordion className="w-full" type="single" collapsible>
              <AccordionItem value="bio">
                <AccordionTrigger className="cursor-pointer">Bio</AccordionTrigger>
                <AccordionContent>
                  {quote && <Field containerClassName="border-none" labelClassName="hidden" fieldClassName="before:content-['“'] after:content-['”'] italic text-sm" field={quote} />}
                  {bio && <Field containerClassName="border-none" labelClassName="hidden" field={bio} />}
                </AccordionContent>
              </AccordionItem>
            </Accordion>}

            <div className="md:flex items-start space-x-4 space-y-2">
              <div className="flex flex-col md:w-1/3 items-center pr-2 none space-y-2">
                <Avatar
                  imagePath={`/characters/eldritch/${(name.value as string).replace(" ", "_")}.webp`}
                  characterId={character.id}
                />
                {action && <Field containerClassName="border-none" labelClassName="text-xs text-[var(--muted-text)]" fieldClassName="text-sm" field={action} />}
                {passive && <Field containerClassName="border-none" labelClassName="text-xs text-[var(--muted-text)]" fieldClassName="text-sm" field={passive} />}
              </div>

              <div className="flex flex-col md:w-2/3 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {health && <Field field={health} icon="/icons/eldritch/health.png" />}
                  {sanity && <Field field={sanity} icon="/icons/eldritch/sanity.png" />}
                </div>

                <div className="grid md:grid-cols-3 gap-2">
                  {lore && <Field field={lore} icon="/icons/eldritch/lore.png" />}
                  {influence && <Field field={influence} icon="/icons/eldritch/influence.png" />}
                  {observation && <Field field={observation} icon="/icons/eldritch/observation.png" />}
                  {strength && <Field field={strength} icon="/icons/eldritch/strength.png" />}
                  {willpower && <Field field={willpower} icon="/icons/eldritch/willpower.png" />}
                </div>

                <div className="grid grid-cols-1">
                  {items && <Field field={items} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
