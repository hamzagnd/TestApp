import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  private apiUrl = 'http://127.0.0.1:8000/api/scenarios/'; // Django API URL

  constructor(private http: HttpClient) { }

  getScenarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addScenario(scenario: any): Observable<any> {
    return this.http.post(this.apiUrl, scenario);
  }

  updateScenario(scenario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${scenario.id}/`, scenario);
  }

  // New methods for steps
  getSteps(scenarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${scenarioId}/steps/`);
  }

  addStep(scenarioId: number, step: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${scenarioId}/steps/`, { ...step, scenario: scenarioId });
  }

  updateStep(scenarioId: number, step: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${scenarioId}/steps/${step.id}/`, { ...step, scenario: scenarioId });
  }

  deleteStep(scenarioId: number, stepId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${scenarioId}/steps/${stepId}/`);
  }
}
