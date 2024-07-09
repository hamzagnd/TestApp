import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api/users/'; 

  constructor(private http: HttpClient) { }

  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}
