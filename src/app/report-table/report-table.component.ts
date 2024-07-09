import { Component, OnInit } from '@angular/core';
import { TableData } from '../models/table-data.model';
import { MatTableDataSource } from '@angular/material/table';

interface Test {
  name: string;
  state: string;
}

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent implements OnInit {

  columns = ['name', 'owner','time','state'];
  data: TableData<Test>[] = [
    new TableData({ name: 'deneme1',owner: 'admin',time: '20-11-2023',state: 'geçti' }),
    new TableData({ name: 'deneme2',owner: 'admin',time: '20-11-2023', state: 'kaldı' }),
  ];
  dataSource: MatTableDataSource<TableData<Test>>;
  selectedTest: Test | null = null;
  expandedElement: Test = null;

  // Donut Chart Variables
  public donutChartData: any[] = [];
  public donutChartLabels: string[] = ['Geçti', 'Kaldı'];
  public donutChartType: string = 'doughnut';

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.updateDonutChartData();
  }

  onRowClick(test: Test) {
    this.selectedTest = test;
    this.expandedElement = this.expandedElement === test ? null : test;
  }

  // Update Donut Chart Data
  updateDonutChartData() {
    const passed = this.data.filter(item => item.data.state === 'geçti').length;
    const failed = this.data.filter(item => item.data.state === 'kaldı').length;
    this.donutChartData = [
      { name: 'Geçti', value: passed },
      { name: 'Kaldı', value: failed }
    ];
    console.log(this.donutChartData);
  }
  getStateClass(state: string): string {
    if (state === 'geçti') {
      return 'passed-state';
    } else if (state === 'kaldı') {
      return 'failed-state';
    } else {
      return '';
    }
  }
}

