import type { FieldType, ICharacter } from "@/data/characters";
import Avatar from "./sheet/Avatar";
import Field from "./sheet/Field";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

type FieldTypeMap = {
  [key: string]: FieldType;
};

export function SpectatorCard({
  character,
  playerName,
}: {
  character: ICharacter;
  playerName?: string;
}) {
  const {
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
    <div className='relative rounded-xl overflow-hidden transition-all duration-300 flex-1 lg:max-w-[550px]'>
      <div className="relative rounded-xl overflow-hidden shadow-lg shadow-black/30">
        <div className="absolute inset-0 bg-cover bg-center opacity-90 sheet-background" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 p-2 space-y-4 border border-[var(--border)] rounded-xl">
          <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-lg shadow-black/30 p-2 space-y-4hover:border-[var(--primary)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-1">
              <h3 className="text-lg tracking-wide font-title">
                {name.value as string} {playerName && `(${playerName})`}
              </h3>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Accordion className="w-full flex-1 basis-full" type="single" collapsible>
                <AccordionItem value="action">
                  <AccordionTrigger className="cursor-pointer text-xs p-0">Detalhes</AccordionTrigger>
                  <AccordionContent>
                    <Field containerClassName="border-none p-1" labelClassName="text-xs text-[var(--muted-text)]" fieldClassName="text-xs" field={action} />
                    <Field containerClassName="border-none p-1" labelClassName="text-xs text-[var(--muted-text)]" fieldClassName="text-xs" field={passive} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="w-auto shrink">
                <Avatar
                  containerClassName="w-20"
                  imagePath={`/characters/eldritch/${(name.value as string).replace(" ", "_")}.webp`}
                  characterId={character.id}
                />
              </div>

              <div className="flex flex-wrap gap-2 flex-1">
                <Field field={health} containerClassName="p-1" bodyContainerClassName="" labelClassName="hidden" icon="/icons/eldritch/health.png" />
                <Field field={sanity} containerClassName="p-1" bodyContainerClassName="flex justify-between" labelClassName="hidden" icon="/icons/eldritch/sanity.png" />
                <Field field={lore} containerClassName="p-1" labelClassName="hidden" icon="/icons/eldritch/lore.png" />
                <Field field={influence} containerClassName="p-1" labelClassName="hidden" icon="/icons/eldritch/influence.png" />
                <Field field={observation} containerClassName="p-1" labelClassName="hidden" icon="/icons/eldritch/observation.png" />
                <Field field={strength} containerClassName="p-1" labelClassName="hidden" icon="/icons/eldritch/strength.png" />
                <Field field={willpower} containerClassName="p-1" labelClassName="hidden" icon="/icons/eldritch/willpower.png" />
                <Field field={items} containerClassName="w-full p-0 border-none flex content-center gap-2" bodyContainerClassName="p-0" labelClassName="hidden" collectionItemClassName="max-w-8" />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
