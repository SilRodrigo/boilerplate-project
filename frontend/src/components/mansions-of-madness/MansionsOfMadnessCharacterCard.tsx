import type { FieldType, ICharacter } from "@/data/characters";
import Avatar from "./sheet/Avatar";
import Field from "./sheet/Field";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Textarea } from "../ui/textarea";

type FieldTypeMap = {
  [key: string]: FieldType;
};

export function MansionsOfMadnessCharacterCard({
  character,
  playerName,
  characterList,
}: {
  character: ICharacter;
  playerName?: string;
  characterList?: ICharacter[];
}) {
  const {
    name,
    bio,
    ability,
    health,
    sanity,
    strength,
    agility,
    observation,
    lore,
    willpower,
    influence,
    notations,
  } = Object.fromEntries(character.fields.map(f => [f.key, f])) as FieldTypeMap;

  let baseHealth, baseSanity;

  if (characterList) {
    const baseCharacter = characterList.find(c => c.id === character.id);

    if (baseCharacter) {
      const {
        health,
        sanity,
      } = Object.fromEntries(baseCharacter!.fields.map(f => [f.key, f])) as FieldTypeMap;

      baseHealth = health.value as number;
      baseSanity = sanity.value as number;
    }
  }

  return (
    <div className='relative rounded-xl overflow-hidden transition-all duration-300'>
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

            {bio && <Accordion className="w-full" type="single" collapsible>
              <AccordionItem value="bio">
                <AccordionTrigger className="cursor-pointer">Bio</AccordionTrigger>
                <AccordionContent>
                  {bio && <Field containerClassName="border-none" labelClassName="hidden" field={bio} />}
                </AccordionContent>
              </AccordionItem>
            </Accordion>}

            <div className="md:flex items-start space-x-4 space-y-2">
              <div className="flex flex-col md:w-1/3 items-center pr-2 none space-y-2">
                <Avatar
                  imagePath={`/characters/mansions-of-madness/${(character.id)}.webp`}
                  characterId={character.id}
                />
                {ability && <Field containerClassName="border-none" labelClassName="text-xs text-[var(--muted-text)]" fieldClassName="text-sm" field={ability} />}
              </div>

              <div className="flex flex-col md:w-2/3 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {health && <Field baseFieldValue={baseHealth} field={health} icon="/icons/mansions-of-madness/health.png" />}
                  {sanity && <Field baseFieldValue={baseSanity} field={sanity} icon="/icons/mansions-of-madness/sanity.png" />}
                </div>

                <div className="grid md:grid-cols-3 gap-2">
                  {strength && <Field field={strength} icon="/icons/mansions-of-madness/strength.png" />}
                  {agility && <Field field={agility} icon="/icons/mansions-of-madness/agility.png" />}
                  {observation && <Field field={observation} icon="/icons/mansions-of-madness/observation.png" />}
                  {lore && <Field field={lore} icon="/icons/mansions-of-madness/lore.png" />}
                  {influence && <Field field={influence} icon="/icons/mansions-of-madness/influence.png" />}
                  {willpower && <Field field={willpower} icon="/icons/mansions-of-madness/willpower.png" />}
                </div>

                <div className="grid grid-cols-1 pt-1">
                  <div className={'text-xs text-[var(--muted-text)] pb-1'}>Anotações</div>
                  {notations && playerName && <Textarea defaultValue={notations.value as string} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
