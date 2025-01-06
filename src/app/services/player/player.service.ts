import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player, PlayerCreate, PlayerUpdate } from '../../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = `${environment.apiDomain}${environment.apiUrl}/players`;

  constructor(private http: HttpClient) { }

  getAllPlayers(teamId?: string): Observable<Player[]> {
    const callUrl = `${this.apiUrl}` + (teamId !== undefined ? `?teamId=${teamId}` : '');
    return this.http.get<Player[]>(callUrl);
  }

  getPlayerById(playerId: string): Observable<Player> {
    const callUrl = `${this.apiUrl}/${playerId}`;
    return this.http.get<Player>(callUrl);
  }

  updatePlayer(playerId: string, updateObject: PlayerUpdate) : Observable<any> {
    return this.http.put(`${this.apiUrl}/${playerId}`, updateObject);
  }

  deletePlayer(playerId: string) : Observable<any> {
    return this.http.delete(`${this.apiUrl}/${playerId}`);
  }

  addPlayer(player: PlayerCreate): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}`, player);
  }
}
