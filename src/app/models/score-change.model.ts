import { MatchEvent } from "./match-event.model";

export type Points = 1 | 2 | 3;

export interface ScoreChange extends MatchEvent {
  scorerId: string,
  points: Points
}

export const points = [1, 2, 3];
