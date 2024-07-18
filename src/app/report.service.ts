import { Injectable } from '@angular/core';
import { TableData } from './models/table-data.model';
import { Test } from './test-control/test';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  getData(): TableData<Test>[] {
    return [
      new TableData({ name: 'deneme1', owner: 'admin', time: '20-11-2023', state: 'geçti' }),
      new TableData({ name: 'deneme2', owner: 'admin', time: '20-11-2023', state: 'kaldı' }),
      new TableData({ name: 'deneme3', owner: 'admin', time: '20-11-2023', state: 'Test Edilmedi' }),
    ];
  }
}
