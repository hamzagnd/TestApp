import { Component, OnInit } from '@angular/core';
import { TableData } from '../models/table-data.model';
import { MatTableDataSource } from '@angular/material/table';

interface Test {
  name: string;
  owner: string;
  time: string;
  state: string;
}

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent implements OnInit {

  columns = ['name', 'owner', 'time', 'state'];
  data: TableData<Test>[] = [
    new TableData({ name: 'deneme1', owner: 'admin', time: '20-11-2023', state: 'geçti' }),
    new TableData({ name: 'deneme2', owner: 'admin', time: '20-11-2023', state: 'kaldı' }),
    new TableData({ name: 'deneme3', owner: 'admin', time: '20-11-2023', state: 'Test Edilmedi' }),
  ];
  dataSource: MatTableDataSource<TableData<Test>>;

  // Donut Chart Variables
  public donutChartData: any[] = [];
  public donutChartLabels: string[] = ['Geçti', 'Kaldı', 'Test Edilmedi'];

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.updateDonutChartData();
  }

  onRowClick(test: Test) {
    console.log('Row clicked:', test);
  }



  // Update Donut Chart Data
  updateDonutChartData() {
    const passed = this.data.filter(item => item.data.state === 'geçti').length;
    const failed = this.data.filter(item => item.data.state === 'kaldı').length;
    const noTested = this.data.filter(item => item.data.state === 'Test Edilmedi').length;
    this.donutChartData = [
      { name: 'Geçti', value: passed },
      { name: 'Kaldı', value: failed },
      { name: 'Test Edilmedi', value: noTested }
    ];
  }
}
