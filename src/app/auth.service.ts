import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';  // Django backend URL
  private loggedIn = false;

  constructor(private http: HttpClient, private router: Router) {
    this.loggedIn = this.isBrowser() ? localStorage.getItem('loggedIn') === 'true' : false;
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, userData).pipe(
      tap(response => {
        if (response.message === 'Login successful') {
          if (this.isBrowser()) {
            localStorage.setItem('loggedIn', 'true');
          }
          this.loggedIn = true;
          this.router.navigate(['/menu']);
        }
      }),
      catchError(this.handleError<any>('login', null))
    );
  }

  logout(): void {
    this.loggedIn = false;
    if (this.isBrowser()) {
      localStorage.removeItem('loggedIn');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
