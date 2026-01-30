import type { Catalog } from "../catalog";
import { items as eldritchItems } from "./eldritch";

export interface IItem {
  id: string;
  name: string;
  image: string;
  modifiers: { [key: string]: number };
  trait: string;
  description: string;
  quantity?: number;
}

export const itemCatalog: { [key in typeof Catalog[keyof typeof Catalog]]: IItem[] } = {
  eldritch: eldritchItems,
};
