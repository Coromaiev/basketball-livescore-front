export interface Player {
  id: string,
  firstName: string,
  lastName: string,
  teamId: string | null,
  number: number | null
}

export interface PlayerCreate {
  firstName: string,
  lastName: string,
  teamId?: string,
  number?: string
}

export interface PlayerUpdate {
  firstName?: string,
  lastName?: string,
  teamId?: string,
  number?: number
}
