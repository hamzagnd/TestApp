import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScenarioService } from '../scenario.service';
import { TableData } from '../models/table-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ScenarioStepperComponent } from '../scenario-stepper/scenario-stepper.component';
import { Subscription } from 'rxjs';

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
export class TestControlComponent implements OnInit, OnDestroy {
  columns = ['name', 'user', 'version', 'state'];
  data: TableData<Test>[] = [];
  dataSource: MatTableDataSource<TableData<Test>> = new MatTableDataSource<TableData<Test>>();
  selectedTest: Test | null = null;
  expandedElement: Test | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(private scenarioService: ScenarioService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getScenarios();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getScenarios(): void {
    const sub = this.scenarioService.getScenarios().subscribe(
      data => {
        this.data = data.map(item => new TableData<Test>(item));
        this.dataSource.data = this.data;
      },
      error => {
        console.error('Error fetching scenarios', error);
      }
    );
    this.subscriptions.add(sub);
  }

  onNameClick(test: Test): void {
    this.selectedTest = test;
    this.openDialog();
  }

  onRowClick(test: Test): void {
    this.selectedTest = test;
    this.expandedElement = this.expandedElement === test ? null : test;
    this.openDialog();
  }

  runTest(test: Test): void {
    console.log("run butonuna basıldı");
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ScenarioStepperComponent, {
      width: '600px',
      data: { scenario: this.selectedTest }
    });

    const sub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateScenario(result);
      }
    });
    this.subscriptions.add(sub);
  }

  closeStepper(): void {
    this.selectedTest = null;
  }

  updateScenario(updatedScenario: Test): void {
    const sub = this.scenarioService.updateScenario(updatedScenario).subscribe(
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
    this.subscriptions.add(sub);
  }
}
