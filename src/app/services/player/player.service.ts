import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player, PlayerCreate, PlayerUpdate } from '../../models/player.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = `${environment.apiDomain}${environment.apiUrl}/players`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllPlayers(teamId?: string, headers?: any): Observable<Player[]> {
    const callUrl = `${this.apiUrl}` + (teamId !== undefined ? `?teamId=${teamId}` : '');
    return this.http.get<Player[]>(callUrl, {
      headers: headers
    });
  }

  getPlayerById(playerId: string, headers?: any): Observable<Player> {
    const callUrl = `${this.apiUrl}/${playerId}`;
    return this.http.get<Player>(callUrl, {
      headers: headers
    });
  }

  updatePlayer(playerId: string, updateObject: PlayerUpdate, headers?: any) : Observable<any> {
    return this.http.put(`${this.apiUrl}/${playerId}`, updateObject, {
      headers: headers
    });
  }

  deletePlayer(playerId: string, headers?: any) : Observable<any> {
    return this.http.delete(`${this.apiUrl}/${playerId}`, {
      headers: headers
    });
  }

  addPlayer(player: PlayerCreate, headers?: any): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}`, player, {
      headers: headers
    });
  }

  quitTeam(playerId: string, headers?: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${playerId}/leave`, null, {
      headers: headers
    });
  }
}
