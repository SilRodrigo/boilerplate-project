import { ICharacter } from "../core/entities/character";
import { FieldType, ScalarType } from "../core/entities/field";
import { IItem } from "../core/entities/item";
import { ELDRITCH_ID, EldritchId } from "./eldritch";
import { characters as eldritchCharacters } from "./eldritch/characters";
import { items as eldritchItems } from "./eldritch/items";
import { setup as eldritchSetup } from "./eldritch/setup";
import { characters as mansionsOfMadnessCharacters } from "./mansions-of-madness/characters";
import { MANSIONS_OF_MADNESS_ID, MansionsOfMadnessId } from "./mansions-of-madness";

type CatalogName = {
  ELDRITCH: EldritchId;
  MANSIONS_OF_MADNESS: MansionsOfMadnessId; 
};

interface Catalog {
  [key: string]: {
    characters: ICharacter[];
    items: IItem[];
    setup: () => void;
  }
}

export const CATALOG: Catalog = {
  [ELDRITCH_ID]: {
    characters: eldritchCharacters,
    items: eldritchItems,
    setup: eldritchSetup,
  },
  [MANSIONS_OF_MADNESS_ID]: {
    characters: mansionsOfMadnessCharacters,
    items: [],
    setup: () => { }
  }
}

export function createField(key: string, label: string, type: ScalarType, value: number | string | boolean): FieldType {
  return {
    key,
    label,
    type,
    value
  }
}

export type GameId = CatalogName[keyof CatalogName];