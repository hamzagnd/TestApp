import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';  // Django backend URL
  private loggedIn = false;
  private currentUser: any = {};  // Store user information
  private userPermissions: any = {};  // Store user permissions
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    this.loadAuthState();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadAuthState();  // Ensure auth state is loaded on every navigation end
      }
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public loadAuthState(): void {
    if (this.isBrowser()) {
      try {
        this.loggedIn = localStorage.getItem('loggedIn') === 'true';
        const currentUser = localStorage.getItem('currentUser');
        const userPermissions = localStorage.getItem('userPermissions');
        const token = localStorage.getItem('access_token');

        this.currentUser = this.parseJsonSafe(currentUser);
        this.userPermissions = this.parseJsonSafe(userPermissions);

        if (token && !this.jwtHelper.isTokenExpired(token)) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
          this.clearAuthState();
        }
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        this.loggedIn = false;
        this.currentUser = {};
        this.userPermissions = {};
        this.clearAuthState();
      }
    }
  }

  private parseJsonSafe(jsonString: string | null): any {
    try {
      if (jsonString === null || jsonString === undefined || jsonString === 'undefined') {
        return {};
      }
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON string:', error);
      return {};
    }
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, userData).pipe(
      tap(response => {
        if (response.message === 'Login successful') {
          this.loggedIn = true;
          this.currentUser = response.user;
          this.userPermissions = response.permissions;
          if (this.isBrowser()) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('userPermissions', JSON.stringify(response.permissions));
            localStorage.setItem('access_token', response.access);
          }
          this.router.navigate(['/test']).then(() => {
            window.location.reload();  // Redirect to test page and refresh the page
          });
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        if (error.status === 400 && error.error) {
          console.error('Error details:', error.error);
        }
        return of(null);
      })
    );
  }

  logout(): void {
    this.clearAuthState();
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
    });
  }

  isLoggedIn(): boolean {
    if (this.isBrowser()) {
      const token = localStorage.getItem('access_token');
      return token != null && !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  canEditUser(): boolean {
    return this.userPermissions.can_edit_user || this.currentUser.is_superuser || false;
  }

  canDeleteUser(): boolean {
    return this.userPermissions.can_delete_user || this.currentUser.is_superuser || false;
  }

  canEditScenario(): boolean {
    return this.userPermissions.can_edit_scenario || this.currentUser.is_superuser || false;
  }

  canDeleteScenario(): boolean {
    return this.userPermissions.can_delete_scenario || this.currentUser.is_superuser || false;
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions[permission] || false;
  }

  isSuperUser(): boolean {
    return this.currentUser.is_superuser || false;
  }

  isStaff(): boolean {
    return this.currentUser.is_staff || false;
  }

  private clearAuthState(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('access_token');
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
