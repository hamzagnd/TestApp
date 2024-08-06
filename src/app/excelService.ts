import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public getSheetNames(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        resolve(wb.SheetNames);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }

  public importFromFile(file: File, sheetName: string, columnIndices: number[]): Promise<{ data: any[], observedList: any[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const ws: XLSX.WorkSheet = wb.Sheets[sheetName];
        if (!ws) {
          reject(new Error(`Sheet ${sheetName} not found`));
          return;
        }
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const columnData = data.slice(1).map((row, index) => ({
          B: row[columnIndices[0]],
          C: row[columnIndices[1]],
          D: row[columnIndices[2]],
          rowNumber: index + 2 // 2-based index for row numbers
        }));

        const observedList = this.createObservedList(columnData);
        resolve({ data: columnData, observedList });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }

  private createObservedList(data: { B: any, C: any, D: any, rowNumber: number }[]): any[] {
    const observedList = [];
    let lastNonEmptyRowNumber = -1;
    let repeatGroup = [];

    data.forEach((row, index) => {
      if (row.B !== undefined && row.B !== null && row.B !== '') {
        if (repeatGroup.length > 0) {
          observedList.push({ unique: lastNonEmptyRowNumber, repeated: [...repeatGroup] });
          repeatGroup = [];
        }
        lastNonEmptyRowNumber = row.rowNumber;
        observedList.push({ unique: row.rowNumber, repeated: [] });
      } else if (lastNonEmptyRowNumber !== -1) {
        repeatGroup.push(row.rowNumber);
      }
    });

    if (repeatGroup.length > 0 && lastNonEmptyRowNumber !== -1) {
      observedList.push({ unique: lastNonEmptyRowNumber, repeated: [...repeatGroup] });
    }

    return observedList;
  }
}
