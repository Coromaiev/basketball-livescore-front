import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Login } from '../../models/login.model';
import { Register } from '../../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  private readonly EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
  private readonly USERNAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
  private readonly USER_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';


  private apiUrl: string = `${environment.apiDomain}${environment.apiUrl}/users`;
  private userRole: string = '';

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
    const token = sessionStorage.getItem('jwtToken');
    return !!token && !this.isTokenExpired(token);
  }

  loadUserRole(): void {
    const token = this.getToken()!;
    if (!token) return;
    try {
      const decoded = this.decodeToken(token);
      this.userRole = decoded[this.ROLE_CLAIM] || '';
    } catch (error) {
      console.error('Error decoding token:', error);
      this.userRole = '';
    }
  }

  hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.includes(this.userRole);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error("Error while decoding token:", error);
      return null;
    }
  }

  logout(): void {
    sessionStorage.removeItem('jwtToken');
  }
}
