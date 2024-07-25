import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { TableData } from '../models/table-data.model';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnDefinition } from '../column';
import { Step, Test } from '../test-control/test';
import { ReportService } from '../report.service';
import { ScenarioService } from "../scenario.service";

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ReportTableComponent implements OnInit {

  columns: ColumnDefinition[] = [
    new ColumnDefinition('step_name', 'Name'),
    new ColumnDefinition('step_procedure', 'Kategori'),
    new ColumnDefinition('step_criteria', 'State'),
    new ColumnDefinition('action', 'Action')
  ];

  data: TableData<Test>[] = [];
  dataSource: MatTableDataSource<TableData<Test>>;

  public donutChartData: any[] = [];
  public donutChartLabels: string[] = ['Geçti', 'Kaldı', 'Test Edilmedi'];
  public scenarioName: string = '';
  public runDate: Date | null = null;


  constructor(private reportService: ReportService, private scenarioService: ScenarioService) {
  }

  ngOnInit(): void {
    this.data = this.reportService.getData();
    this.dataSource = new MatTableDataSource(this.data);
    this.scenarioName = this.reportService.getScenarioName();
    this.runDate = this.reportService.getRunDate();

    this.updateDonutChartData();
  }

  onRowClick(test: Test) {
    //console.log('Row clicked:', test);

  }

  updateDonutChartData() {
    const passed = this.data.filter(item => item.data.step_criteria === 'geçti').length;
    const failed = this.data.filter(item => item.data.step_criteria === 'kaldı').length;
    const notTested = this.data.filter(item => item.data.step_criteria === 'Test Edilmedi').length;

    this.donutChartData = [
      {name: 'Geçti', value: passed},
      {name: 'Kaldı', value: failed},
      {name: 'Test Edilmedi', value: notTested}
    ];
  }

  onCriteriaChange(step: any, criteria: string) {
    console.log(step.data.id, criteria, step.data);
    this.reportService.updateSuccessCriteria(step.data.id, criteria);
    this.updateDonutChartData();
  }
}
