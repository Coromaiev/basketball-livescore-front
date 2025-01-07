import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = `${environment.apiDomain}${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAll(headers?: any): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`, {
      headers: headers
    })
  }
}
