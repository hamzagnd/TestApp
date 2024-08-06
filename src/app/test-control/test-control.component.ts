import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScenarioService } from '../scenario.service';
import { TableData } from '../models/table-data.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScenarioStepperComponent } from '../scenario-stepper/scenario-stepper.component';
import { Subscription } from 'rxjs';
import { ColumnDefinition, ColumnType } from '../column';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { AuthService } from '../auth.service';

interface Test {
  id: number;
  name: string;
  user: string;
  version: string;
  state: string;
  owner: string;
  time: string;
}

@Component({
  selector: 'app-test-control',
  templateUrl: './test-control.component.html',
  styleUrls: ['./test-control.component.css']
})
export class TestControlComponent implements OnInit, OnChanges, OnDestroy {

  @Output() runTestClick = new EventEmitter<Test>();

  columns: ColumnDefinition[] = [
    new ColumnDefinition('name', 'Scenario Name', ColumnType.STRING),
    new ColumnDefinition('user', 'User', ColumnType.STRING),
    new ColumnDefinition('version', 'Version', ColumnType.STRING),
    new ColumnDefinition('state', 'State', ColumnType.STRING),
    new ColumnDefinition('run', 'Run', ColumnType.CUSTOM),
    new ColumnDefinition('delete', 'Delete', ColumnType.CUSTOM)
  ];

  data: TableData<Test>[] = [];
  dataSource: MatTableDataSource<TableData<Test>> = new MatTableDataSource<TableData<Test>>();
  selectedTest: Test | null = null;
  private subscriptions: Subscription = new Subscription();
  public dialogRef: MatDialogRef<ScenarioStepperComponent>;

  displayedColumnKeys: string[] = [];
  reportDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  errorMessage: string = '';

  constructor(
    private scenarioService: ScenarioService,
    private reportService: ReportService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getScenarios();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.displayedColumnKeys = this.columns.map(c => c.key).concat('run', 'delete');
    }
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

  onRowClick(test: Test): void {
    this.selectedTest = test;
    this.openDialog();
  }

  runTest(test: Test): void {
    event.stopPropagation();

    this.scenarioService.getScenario(test.id).subscribe(
      scenario => {
        const steps = scenario.steps;
        const reportData = steps.map(step => new TableData<Test>(step));

        this.reportDataSource.data = reportData;
        this.reportService.setData(reportData);
        this.reportService.setScenarioName(test.name);
        this.reportService.setRunDate(new Date());

        console.log("Run butonuna basıldı ve adımlar yüklendi", steps);
        this.router.navigate(['/report']);
      },
      error => {
        console.error('Error fetching scenario', error);
      }
    );
  }

  openDialog(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser.is_superuser || currentUser.is_staff) {
      const dialogRef = this.dialog.open(ScenarioStepperComponent, {
        width: '90vw',  // Genişliği artırarak pencerenin yatay olmasını sağlıyoruz
        maxWidth: '90vw',  // Maksimum genişliği ayarlayarak pencerenin ekrana sığmasını sağlıyoruz
        data: { scenario: this.selectedTest }
      });

      const sub = dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateScenario(result);
        }
      });
      this.subscriptions.add(sub);
    } else {
      this.errorMessage = 'You do not have permission to add or edit scenarios.';
    }
  }

  closeStepper(): void {
    this.selectedTest = null;
  }

  updateScenario(updatedScenario: Test): void {
    const sub = this.scenarioService.updateScenario(updatedScenario.id, updatedScenario).subscribe(
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

  deleteTest(test: Test): void {
    event.stopPropagation();
    if (this.authService.getCurrentUser().is_superuser || this.authService.getCurrentUser().is_staff) {
      if (confirm(`Are you sure you want to delete scenario ${test.name}?`)) {
        this.scenarioService.deleteScenario(test.id).subscribe(
          () => {
            this.data = this.data.filter(item => item.data.id !== test.id);
            this.dataSource.data = this.data;
          },
          error => {
            console.error('Error deleting scenario', error);
          }
        );
      }
    } else {
      alert('You do not have permission to delete this scenario');
    }
  }
}