import { MatchEvent } from "./match-event.model";

export type FaultType = 'P0' | 'P1' | 'P2' | 'P3';

export interface Fault extends MatchEvent {
  faultyPlayerId: string,
  faultType: FaultType
}

export const faultTypes = ['P0', 'P1', 'P2', 'P3']
