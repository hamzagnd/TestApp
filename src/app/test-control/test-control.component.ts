import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScenarioService } from '../scenario.service';
import { TableData } from '../models/table-data.model';

interface Test {
  name: string;
  user: string;
  version: string;
  state: string;
  subItems?: Test[];
}

@Component({
  selector: 'app-test-control',
  templateUrl: './test-control.component.html',
  styleUrls: ['./test-control.component.css']
})
export class TestControlComponent implements OnInit {
  columns = ['name', 'user', 'version', 'state'];
  data: TableData<Test>[] = [];
  dataSource: MatTableDataSource<TableData<Test>>;
  selectedTest: Test | null = null;
  expandedElement: Test | null = null;

  constructor(private scenarioService: ScenarioService) { }

  ngOnInit(): void {
    this.getScenarios();
  }

  getScenarios(): void {
    this.scenarioService.getScenarios().subscribe(
      data => {
        this.data = data.map(item => new TableData<Test>(item));
        this.dataSource = new MatTableDataSource(this.data);
      },
      error => {
        console.error('Error fetching scenarios', error);
      }
    );
  }

  onNameClick(test: Test): void {
    this.selectedTest = test;
  }

  onRowClick(test: Test): void {
    this.selectedTest = test;
    this.expandedElement = this.expandedElement === test ? null : test;
  }

  closeStepper(): void {
    this.selectedTest = null;
  }
}
