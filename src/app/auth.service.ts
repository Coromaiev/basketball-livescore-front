import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Login } from './models/login.model';
import { Register } from './models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  login(loginData: Login): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  register(registerData: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  saveToken(token: string): void {
    sessionStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('user');
  }
}
