import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScenarioService } from '../scenario.service';
import { TableData } from '../models/table-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ScenarioStepperComponent } from '../scenario-stepper/scenario-stepper.component';
import { ColumnDefinition, ColumnType } from '../column';
import { Router } from '@angular/router';

interface Test {
  id: number;
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
export class TestControlComponent implements OnInit, OnChanges {
  columns: ColumnDefinition[] = [
    new ColumnDefinition('name', 'Name', ColumnType.STRING),
    new ColumnDefinition('user', 'User', ColumnType.STRING),
    new ColumnDefinition('version', 'Version', ColumnType.STRING),
    new ColumnDefinition('state', 'State', ColumnType.ENUM),
    new ColumnDefinition('run', 'Run', ColumnType.CUSTOM)
  ];
  data: TableData<Test>[] = [];
  dataSource: MatTableDataSource<TableData<Test>> = new MatTableDataSource<TableData<Test>>();
  selectedTest: Test | null = null;
  expandedElement: Test | null = null;

  displayedColumnKeys: string[] = [];

  constructor(private scenarioService: ScenarioService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getScenarios();
    this.displayedColumnKeys = this.columns.map(c => c.key).concat('run');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.displayedColumnKeys = this.columns.map(c => c.key).concat('run');
    }
  }

  getScenarios(): void {
    this.scenarioService.getScenarios().subscribe(
      data => {
        this.data = data.map(item => new TableData<Test>(item));
        this.dataSource.data = this.data;
      },
      error => {
        console.error('Error fetching scenarios', error);
      }
    );
  }

  onNameClick(test: Test): void {
    this.selectedTest = test;
    this.openDialog();
  }

  onRowClick(test: Test): void {
    this.selectedTest = test;
    this.openDialog();
  }

  runTest(test: Test) {
    console.log("run butonuna basıldı");
    this.router.navigate(['/report']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ScenarioStepperComponent, {
      width: '600px',
      data: { scenario: this.selectedTest }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateScenario(result);
      }
    });
  }

  closeStepper(): void {
    this.selectedTest = null;
  }

  updateScenario(updatedScenario: Test): void {
    this.scenarioService.updateScenario(updatedScenario).subscribe(
      response => {
        const index = this.data.findIndex(item => item.data.id === updatedScenario.id);
        if (index !== -1) {
          this.data[index] = new TableData<Test>(updatedScenario);
          this.dataSource.data = [...this.data];
        }
        this.closeStepper();
      },
      error => {
        console.error('Error updating scenario', error);
      }
    );
  }
}
