import { Component, OnInit, ViewChild, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ScenarioService } from '../scenario.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-scenario-stepper',
  templateUrl: './scenario-stepper.component.html',
  styleUrls: ['./scenario-stepper.component.css']
})
export class ScenarioStepperComponent implements OnInit {
  @Input() scenario: any;
  @Output() scenarioUpdated = new EventEmitter<any>();

  steps: any[] = [];
  stepForm: FormGroup;
  selectedStepIndex: number | null = null;

  pageSize = 5;
  pageIndex = 0;
  paginatedSteps: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
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
    this.stepForm = this.fb.group({
      step_name: ['', Validators.required],
      step_procedure: ['', Validators.required],
      step_criteria: ['', Validators.required]
    });

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

  addStep(): void {
    if (this.stepForm.valid) {
      const newStep = this.stepForm.value;
      if (this.selectedStepIndex !== null) {
        const absoluteIndex = this.pageIndex * this.pageSize + this.selectedStepIndex;
        this.scenarioService.updateStep(this.scenario.id, { ...newStep, id: this.steps[absoluteIndex].id }).subscribe(updatedStep => {
          this.steps[absoluteIndex] = updatedStep;

          this.selectedStepIndex = null;
          this.stepForm.reset();
          this.loadSteps(); // Refresh the steps
        });
      } else {
        this.scenarioService.addStep(this.scenario.id, newStep).subscribe(step => {
          this.steps.push(step);
          this.stepForm.reset();
          this.loadSteps(); // Refresh the steps
        }, error => {
          console.error('Error adding step:', error);
        });
      }
    }
  }

  editStep(index: number): void {
    const absoluteIndex = this.pageIndex * this.pageSize + index
    this.selectedStepIndex = index;
    this.stepForm.patchValue(this.steps[absoluteIndex]);
  }

  deleteStep(index: number): void {
    const absoluteIndex = this.pageIndex * this.pageSize + index;
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const stepId = this.steps[absoluteIndex].id;
        this.scenarioService.deleteStep(this.scenario.id, stepId).subscribe(() => {
          this.steps.splice(absoluteIndex, 1);
          this.loadSteps(); // Refresh the steps
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
