import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelService } from '../excelService';

@Component({
  selector: 'app-test-case-table',
  templateUrl: './test-case-table.component.html',
  styleUrls: ['./test-case-table.component.css']
})
export class TestCaseTableComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['B', 'C', 'D', 'rowNumber'];
  sheetNames: string[] = [];
  selectedSheet: string = '';
  file: File | null = null;
  observedList: any[] = [];

  constructor(private excelService: ExcelService) { }

  ngOnInit() {
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.excelService.getSheetNames(this.file).then(names => {
        this.sheetNames = names;
        if (names.length > 0) {
          this.selectedSheet = names[0];
          this.loadSheetData(this.selectedSheet);
        }
      }).catch(error => console.error('Sheet names loading error:', error));
    } else {
      console.error('Dosya seçilmedi');
    }
  }

  onSheetChange(event: any) {
    this.selectedSheet = event.target.value;
    if (this.file) {
      this.loadSheetData(this.selectedSheet);
    }
  }

  private loadSheetData(sheetName: string) {
    if (this.file) {
      this.excelService.importFromFile(this.file, sheetName, [1, 2, 3]).then(result => { // 1: B sütunu, 2: C sütunu, 3: D sütunu
        if (result.data && result.data.length > 0) {
          this.dataSource.data = result.data;
          this.observedList = result.observedList;
          console.log('Observed List:', this.observedList);
        } else {
          console.error('Excel dosyasından veri alınamadı veya boş');
        }
      }).catch(error => console.error('Veri yüklenirken hata oluştu:', error));
    }
  }
}
