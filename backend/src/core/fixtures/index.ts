import { EldritchId } from "./eldritch";
import { characters as eldritchCharacters } from "./eldritch/characters";
import { items as eldritchItems } from "./eldritch/items";
import { setup as eldritchSetup } from "./eldritch/setup";

type CatalogName = {
  ELDRITCH: EldritchId;
};

export const CATALOG = {
  eldritch: {
    characters: eldritchCharacters,
    items: eldritchItems,
    setup: eldritchSetup,
  },
};

export type GameId = CatalogName[keyof CatalogName];