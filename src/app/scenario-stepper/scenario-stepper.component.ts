import { Component, OnInit, ViewChild, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ScenarioService } from '../scenario.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StepFormComponent } from '../step-form/step-form.component';

@Component({
  selector: 'app-scenario-stepper',
  templateUrl: './scenario-stepper.component.html',
  styleUrls: ['./scenario-stepper.component.css']
})
export class ScenarioStepperComponent implements OnInit {
  @Input() scenario: any;
  @Output() scenarioUpdated = new EventEmitter<any>();

  steps: any[] = [];
  selectedStepIndex: number | null = null;

  pageSize = 5;
  pageIndex = 0;
  paginatedSteps: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<ScenarioStepperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private scenarioService: ScenarioService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    if (data) {
      this.scenario = data.scenario;
    }
  }

  ngOnInit(): void {
    if (this.scenario) {
      this.loadSteps();
    }
  }


  loadSteps(): void {
    this.scenarioService.getScenario(this.scenario.id).subscribe(scenario => {
      this.steps = scenario.steps;
      this.updatePaginatedSteps();
    }, error => {
      console.error('Error loading steps:', error);
    });
  }

  updatePaginatedSteps(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSteps = this.steps.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedSteps();
  }

  openStepDialog(step: any = null, index: number | null = null): void {
    const dialogRef = this.dialog.open(StepFormComponent, {
      width: '400px',
      data: { step }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (index !== null) {
          this.updateStep(result, index);
        } else {
          this.addStep(result);
        }
      }
    });
  }

  addStep(stepData: any): void {
    this.scenarioService.addStep(this.scenario.id, stepData).subscribe(step => {
      this.steps.push(step);
      this.updatePaginatedSteps(); // Refresh the steps
    }, error => {
      console.error('Error adding step:', error);
    });
  }

  updateStep(stepData: any, index: number): void {
    const absoluteIndex = this.pageIndex * this.pageSize + index;
    const stepId = this.steps[absoluteIndex].id;
    this.scenarioService.updateStep(this.scenario.id, { ...stepData, id: stepId }).subscribe(updatedStep => {
      this.steps[absoluteIndex] = updatedStep;
      this.updatePaginatedSteps(); // Refresh the steps
    });
  }

  editStep(index: number): void {
    const absoluteIndex = this.pageIndex * this.pageSize + index;
    this.openStepDialog(this.steps[absoluteIndex], index);
  }

  deleteStep(index: number): void {
    const absoluteIndex = this.pageIndex * this.pageSize + index;
    const stepId = this.steps[absoluteIndex].id;
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scenarioService.deleteStep(this.scenario.id, stepId).subscribe(() => {
          this.steps.splice(absoluteIndex, 1);
          this.updatePaginatedSteps(); // Refresh the steps
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
