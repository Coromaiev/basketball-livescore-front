import { MatchEvent } from "./match-event.model";

export interface PlayerChange extends MatchEvent {
  leavingPlayerId: string,
  replacingPlayerId: string
}
