import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  private apiUrl = 'http://127.0.0.1:8000/api/scenarios/';

  constructor(private http: HttpClient) { }

  getScenarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addScenario(scenario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, scenario);
  }
}
