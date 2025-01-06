import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match, MatchCreate } from '../../models/match.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = `${environment.apiDomain}${environment.apiUrl}/matchs`

  constructor(private http: HttpClient, private authService: AuthService) { }

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  addMatch(matchData: MatchCreate): Observable<Match> {
    console.log(matchData);
    return this.http.post<Match>(this.apiUrl, matchData, {
      headers: {
        "Authorization": `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
