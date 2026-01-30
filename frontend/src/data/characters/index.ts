import type { Catalog } from "../catalog";
import type { IItem } from "../items";
import { characters as eldritchCharacters } from "./eldritch";

export type ScalarType = "number" | "string" | "boolean";
export type CollectionType = "collection";

interface ScalarField {
  key: string;
  label: string;
  type: ScalarType;
  value: number | string | boolean;
}

interface CollectionField {
  key: string;
  label: string;
  type: CollectionType;
  value: IItem[];
}

export type FieldType = ScalarField | CollectionField;

export interface ICharacter {
  id: string;
  name: string;
  image: string;
  quote: string;
  bio: string;
  job: string;
  action: string;
  passive: string;
  initialSpace: string;
  fields: FieldType[];
}

export const characterCatalog: { [key in typeof Catalog[keyof typeof Catalog]]: ICharacter[] } = {
  eldritch: eldritchCharacters,
};
