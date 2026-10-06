import { ICharacter } from "./character";
import { IItem } from "./item";

export interface ICatalog {
  [key: string]: {
    characters: ICharacter[];
    items: IItem[];
    setup: () => void;
  };
}
