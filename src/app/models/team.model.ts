import { Player } from "./player.model";

export interface Team {
  id: string,
  name: string,
  players: Player[]
}
