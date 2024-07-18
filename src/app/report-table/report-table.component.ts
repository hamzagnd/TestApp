import { Component, OnInit } from '@angular/core';
import { TableData } from '../models/table-data.model';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnDefinition } from '../column';
import { Test } from '../test-control/test';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent implements OnInit {

  columns: ColumnDefinition[] = [
    new ColumnDefinition('name', 'Name'),
    new ColumnDefinition('owner', 'Owner'),
    new ColumnDefinition('time', 'Time'),
    new ColumnDefinition('state', 'State')
  ];

  data: TableData<Test>[] = [];
  dataSource: MatTableDataSource<TableData<Test>>;

  public donutChartData: any[] = [];
  public donutChartLabels: string[] = ['Geçti', 'Kaldı', 'Test Edilmedi'];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.data = this.reportService.getData();
    this.dataSource = new MatTableDataSource(this.data);
    this.updateDonutChartData();
  }

  onRowClick(test: Test) {
    console.log('Row clicked:', test);
  }

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
