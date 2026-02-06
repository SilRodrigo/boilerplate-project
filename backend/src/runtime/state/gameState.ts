import { IPlayer } from "../../core/entities/player";
import { ISpectator } from "../../core/entities/spectator";

export type GameState = {
  gameId: string;
  adminToken: string;
  players: IPlayer[];
  spectators: ISpectator[];
};
