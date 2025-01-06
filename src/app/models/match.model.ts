import { Fault } from "./fault.model"
import { PlayerChange } from "./player-change.model"
import { ScoreChange } from "./score-change.model"
import { Team } from "./team.model"
import { TimeOut } from "./time-out.model"
import { User } from "./user.model"

export interface Match {
  id: string,
  quarterDuration: number,
  quarterNumber: number,
  timeoutDuration: number,
  visitors: Team,
  hosts: Team,
  fieldPlayers: string[],
  prepEncoder: User,
  playEncoders: User[],
  hostsScore: number,
  visitorsScore: number,
  events: {
    faults: Fault[],
    playerChanges: PlayerChange[],
    scoreChanges: ScoreChange[],
    timeOuts: TimeOut[]
  }
}

export interface MatchCreate {
  quarterDuration?: number,
  quarterNumber?: number,
  timeOutDuration?: number,
  visitorsId: string,
  hostsId: string,
  prepEncoderId?: string
}
