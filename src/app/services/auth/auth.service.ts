import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Login } from '../../models/login.model';
import { Register } from '../../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public static readonly ADMIN_ROLE = 'Admin';
  public static readonly ENCODER_ROLES = ['Encoder', 'Admin'];
  private readonly CLAIMS = {
    ROLE: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    EMAIL: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    USERNAME: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    USER_ID: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  };
  private currentUserRoleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private apiUrl: string = `${environment.apiDomain}${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
    const savedRole = this.getSavedRole();
    if (savedRole) {
      this.setCurrentUserRole(savedRole);
    }
  }

  login(loginData: Login): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: any) => {
        const role = response.user.permission; // Assuming the API response contains the role
        this.setCurrentUserRole(role); // Set the role after login
      })
    );
  }

  register(registerData: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  saveToken(token: string): void {
    sessionStorage.setItem('jwtToken', token);
    const role = this.getCurrentUserRole();
    this.setCurrentUserRole(role);
  }

  getToken(): string | null {
    return sessionStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  hasRole(requiredRoles: string[]): boolean {
    var currentUserRole = this.getCurrentUserRole();
    return currentUserRole ? requiredRoles.includes(currentUserRole) : false;
  }

  getAuthHeader(): any {
    return {
      "Authorization": `Bearer ${this.getToken()}`
    };
  }

  getUserRoleSubject(): Observable<string | null> {
    return this.currentUserRoleSubject.asObservable();
  }

  setCurrentUserRole(role: string | null): void {
    this.currentUserRoleSubject.next(role);
    this.saveRoleToStorage(role); // Save role to sessionStorage
  }

  getCurrentUserClaim(claim: string): any {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded ? decoded[claim] : null;
    }
    return null;
  }

  getCurrentUserId(): string | null {
    return this.getCurrentUserClaim(this.CLAIMS.USER_ID);
  }

  getCurrentUserRole(): string | null {
    return this.getCurrentUserClaim(this.CLAIMS.ROLE);
  }

  getCurrentUserEmail(): string | null {
    return this.getCurrentUserClaim(this.CLAIMS.EMAIL);
  }

  getCurrentUsername(): string | null {
    return this.getCurrentUserClaim(this.CLAIMS.USERNAME);
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
    this.setCurrentUserRole(null);
  }

  private saveRoleToStorage(role: string | null): void {
    if (role) {
      sessionStorage.setItem('userRole', role);
    } else {
      sessionStorage.removeItem('userRole');
    }
  }

  private getSavedRole(): string | null {
    return sessionStorage.getItem('userRole');
  }
}
