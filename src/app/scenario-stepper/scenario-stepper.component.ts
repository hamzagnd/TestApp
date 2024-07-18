import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
  maxSteps = 10;  // Maximum number of steps

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
      category: ['', Validators.required],
      success_criteria: ['', Validators.required]
    });

    if (this.scenario) {
      this.loadSteps();
    }
  }

  loadSteps(): void {
    this.scenarioService.getSteps(this.scenario.id).subscribe(steps => {
      this.steps = steps;
    });
  }

  addStep(): void {
    if (this.steps.length >= this.maxSteps) {
      this.snackBar.open('You have reached the maximum number of steps', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (this.stepForm.valid) {
      const newStep = this.stepForm.value;
      if (this.selectedStepIndex !== null) {
        this.scenarioService.updateStep(this.scenario.id, { ...newStep, id: this.steps[this.selectedStepIndex].id }).subscribe(updatedStep => {
          this.steps[this.selectedStepIndex] = updatedStep;
          this.selectedStepIndex = null;
          this.stepForm.reset();
          this.loadSteps(); // Refresh the page
        });
      } else {
        this.scenarioService.addStep(this.scenario.id, newStep).subscribe(step => {
          this.steps.push(step);
          this.stepForm.reset();
          this.loadSteps(); // Refresh the page
        }, error => {
          console.error('Error adding step:', error);
        });
      }
    }
  }

  editStep(index: number): void {
    this.selectedStepIndex = index;
    this.stepForm.patchValue(this.steps[index]);
  }

  deleteStep(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const stepId = this.steps[index].id;
        this.scenarioService.deleteStep(this.scenario.id, stepId).subscribe(() => {
          this.steps.splice(index, 1);
          this.loadSteps(); // Refresh the page
        });
      }
    });
  }

  submit(): void {
    const updatedScenario = {
      ...this.scenario,
      steps: this.steps
    };
    this.scenarioService.updateScenario(updatedScenario).subscribe(() => {
      this.scenarioUpdated.emit(updatedScenario);
      this.dialogRef.close(updatedScenario);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
