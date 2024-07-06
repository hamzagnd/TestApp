import { Component, OnInit } from '@angular/core';
import { ScenarioService } from '../scenario.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-test-case-table',
  templateUrl: './test-case-table.component.html',
  styleUrls: ['./test-case-table.component.css']
})
export class TestCaseTableComponent implements OnInit {
  scenarios: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'user', 'version', 'state'];

  constructor(private scenarioService: ScenarioService) { }

  ngOnInit(): void {
    this.getScenarios();
  }

  getScenarios(): void {
    this.scenarioService.getScenarios().subscribe(
      data => {
        this.scenarios = new MatTableDataSource(data);
      },
      error => {
        console.error('Error fetching scenarios', error);
      }
    );
  }
}
