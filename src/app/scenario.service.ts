import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  private apiUrl = 'http://127.0.0.1:8000/api/scenarios/'; // Django API URL
  private uploadUrl = 'http://127.0.0.1:8000/api/upload-excel/'; // Upload Excel URL


  constructor(private http: HttpClient) { }

  getScenarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getScenario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  addScenario(scenario: any): Observable<any> {
    return this.http.post(this.apiUrl, scenario);
  }

  updateScenario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, data);
  }

  deleteScenario(scenarioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${scenarioId}/`);
  }

  getSteps(scenarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${scenarioId}/steps/`);
  }

  addStep(scenarioId: number, step: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${scenarioId}/steps/`, { ...step, scenario: scenarioId });
  }

  updateStep(scenarioId: number, step: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${scenarioId}/steps/${step.id}/`, { ...step, scenario: scenarioId });
  }


  updateSteps(scenarioId: number, stepId: number, step: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${scenarioId}/steps/${stepId}/`, { ...step, scenario: scenarioId });
  }


  deleteStep(scenarioId: number, stepId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${scenarioId}/steps/${stepId}/`);
  }
  uploadExcel(file: File, sheetName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('sheet_name', sheetName);
    return this.http.post(this.uploadUrl, formData);
  }
  
  
}