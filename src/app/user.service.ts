import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api';  // Django backend URL

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/`);
  }

  updateUserPermissions(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${user.id}/update_permissions/`, user);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/`, user);
  }

  getUserPermissions(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/permissions/`);
  }
}
