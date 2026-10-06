import type { catalog } from "../catalog";
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

export const itemCatalog: { [key in typeof catalog[keyof typeof catalog]]: IItem[] } = {
  eldritch: eldritchItems,
};
