import { Injectable } from '@angular/core';
import { TableData } from './models/table-data.model';
import { Test } from './test-control/test';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportData: TableData<Test>[] = [];
  private scenarioName: string = '';
  private runDate: Date | null = null;


  getData(): TableData<Test>[] {
    return this.reportData;
  }

  setData(data: TableData<Test>[]): void {
    this.reportData = data;
  }

  updateSuccessCriteria(index: number, criteria: string) {
    if (this.reportData[index]) {
      this.reportData[index].data.success_criteria = criteria;
    }
  }

  setScenarioName(name: string): void {
    this.scenarioName = name;
  }

  getScenarioName(): string {
    return this.scenarioName;
  }
  setRunDate(date: Date): void {
    this.runDate = date;
  }

  getRunDate(): Date | null {
    return this.runDate;
  }
}
