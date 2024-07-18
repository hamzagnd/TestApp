import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';  // Django backend URL
  private loggedIn = false;
  private currentUser: any = {};  // Store user information
  private userPermissions: any = {};  // Store user permissions

  constructor(private http: HttpClient, private router: Router) {
    this.loadAuthState();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadAuthState();  // Ensure auth state is loaded on every navigation end
      }
    });
  }

  public loadAuthState(): void {  
    if (this.isBrowser()) {
      this.loggedIn = localStorage.getItem('loggedIn') === 'true';
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    }
  }

  login(userData: any): Observable<any> {
    console.log('Sending login request:', userData);  // Debugging line
    return this.http.post<any>(`${this.apiUrl}/login/`, userData).pipe(
      tap(response => {
        console.log('Received login response:', response);  // Debugging line
        if (response.message === 'Login successful') {
          this.loggedIn = true;
          this.currentUser = response.user;
          this.userPermissions = response.permissions;
          if (this.isBrowser()) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('userPermissions', JSON.stringify(response.permissions));
          }
          this.router.navigate(['/test']);  // Redirect to test page after login
        }
      }),
      catchError(this.handleError<any>('login', null))
    );
  }
  
  logout(): void {
    this.loggedIn = false;
    this.currentUser = {};
    this.userPermissions = {};
    if (this.isBrowser()) {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userPermissions');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  canEditUser(): boolean {
    return this.userPermissions.canEditUser || false;
  }

  canDeleteUser(): boolean {
    return this.userPermissions.canDeleteUser || false;
  }

  canEditScenario(): boolean {
    return this.userPermissions.canEditScenario || false;
  }

  canDeleteScenario(): boolean {
    return this.userPermissions.canDeleteScenario || false;
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions[permission] || false;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);  // Debugging line
      return of(result as T);
    };
  }
}
