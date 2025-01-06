import { MatchEvent } from "./match-event.model";

export interface TimeOut extends MatchEvent {
  invokerId: string
}
