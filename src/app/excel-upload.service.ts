import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelUploadService {
  private apiUrl = 'http://127.0.0.1:8000/api/upload-excel/';

  constructor(private http: HttpClient) {}

  uploadExcel(file: File, sheetName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('sheet_name', sheetName);

    return this.http.post(this.apiUrl, formData);
  }
}
