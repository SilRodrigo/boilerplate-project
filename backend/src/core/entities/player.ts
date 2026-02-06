import { ICharacter } from "./character";

export interface IPlayer {
  token: string;
  name: string;
  character: ICharacter;
}