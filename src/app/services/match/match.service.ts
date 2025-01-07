import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match, MatchCreate, MatchListUpdate, MatchPrepUpdate } from '../../models/match.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = `${environment.apiDomain}${environment.apiUrl}/matchs`

  constructor(private http: HttpClient, private authService: AuthService) { }

  getMatches(headers?: any): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl, {
      headers: headers
    });
  }

  getMatchById(matchId: string, headers?: any): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${matchId}`, {
      headers: headers
    });
  }

  getMatchesByEncoder(userId: string, headers?: any): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/encoder/${userId}`, {
      headers: headers
    })
  }

  addMatch(matchData: MatchCreate, headers?: any): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, matchData, {
      headers: headers
    });
  }

  updatePlayers(matchId: string, team: 'hosts' | 'visitors', playersChanges: MatchListUpdate, headers?: any) {
    return this.http.put<Match>(`${this.apiUrl}/${matchId}/players:${team}`, playersChanges, {
      headers: headers
    });
  }

  updateEncoders(matchId: string, encodersChanges: MatchListUpdate, headers?: any) {
    return this.http.put<Match>(`${this.apiUrl}/${matchId}/encoders`, encodersChanges, {
      headers: headers
    });
  }

  updatePrep(matchId: string, update: MatchPrepUpdate, headers?: any) {
    return this.http.put<Match>(`${this.apiUrl}/${matchId}/prep`, update, {
      headers: headers
    });
  }
}
