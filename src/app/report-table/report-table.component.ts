import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TableData} from '../models/table-data.model';
import {MatTableDataSource} from '@angular/material/table';
import {ColumnDefinition, ColumnType} from '../column';
import {Test} from '../test-control/test';
import {ReportService} from '../report.service';
import {ScenarioService} from "../scenario.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReportTableComponent implements OnInit {

  columns: ColumnDefinition[] = [

    new ColumnDefinition('vtd_madde_no', 'VTD Madde NO',ColumnType.STRING),
    new ColumnDefinition('testAdimlari', 'Test Adımları',ColumnType.STRING),
    new ColumnDefinition('kabulKriteri', 'Kabul Kriteri',ColumnType.STRING),
    new ColumnDefinition('durum', 'State',ColumnType.STRING),
    new ColumnDefinition('action', 'Action',ColumnType.CUSTOM),
    new ColumnDefinition('expand', 'Expand', ColumnType.CUSTOM)
  ];

  data: TableData<Test>[] = [];
  dataSource: MatTableDataSource<TableData<Test>>;
  expandedElement: Test | null;

  public donutChartData: any[] = [];
  public donutChartLabels: string[] = ['Geçti', 'Kaldı', 'Test Edilmedi'];
  public scenarioName: string = '';
  public runDate: Date | null = null;
  scenarioId: number | null = null;
  changes: any[] = [];

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
    // console.log('Row clicked:', test);
  }

  updateDonutChartData() {
    const passed = this.data.filter(item => item.data.durum === 'geçti').length;
    const failed = this.data.filter(item => item.data.durum === 'kaldı').length;
    const notTested = this.data.filter(item => item.data.durum === 'Test Edilmedi').length;

    this.donutChartData = [
      {name: 'Geçti', value: passed},
      {name: 'Kaldı', value: failed},
      {name: 'Test Edilmedi', value: notTested}
    ];
  }

  onCriteriaChange(step: any, criteria: string) {
    this.reportService.updateSuccessCriteria(step.data.id, criteria);
    console.log(step.data.scenario);
    this.scenarioId = step.data.scenario;
    const updatedStep = { ...step.data, step_criteria: criteria };
    this.changes.push(updatedStep);
    console.log(step.data);
    console.log(this.reportService.getData());
  }

  submit() {
    console.log(this.scenarioId);
    if (this.scenarioId !== null) {
      this.changes.forEach(change => {
        this.scenarioService.updateStep(this.scenarioId, change).subscribe(
          response => {
            console.log(`Step ${change.id} updated successfully`, response);
          },
          error => {
            console.error(`Error updating step ${change.id}`, error);
          }
        );
      });
      this.changes = [];
      this.updateDonutChartData();
    } else {
      console.error('Scenario ID is null');
    }
  }

}

