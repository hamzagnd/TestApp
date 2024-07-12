import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-scenario-stepper',
  templateUrl: './scenario-stepper.component.html',
  styleUrls: ['./scenario-stepper.component.css']
})
export class ScenarioStepperComponent implements OnInit {
  @Input() scenario: any;
  @Output() scenarioUpdated = new EventEmitter<any>();

  steps: FormGroup[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScenarioStepperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.scenario = data.scenario;
    }
  }

  ngOnInit(): void {
    this.addStep();
    if (this.scenario) {
      this.steps[0].patchValue({
        name: this.scenario.name,
        user: this.scenario.user,
        version: this.scenario.version,
        state: this.scenario.state
      });
    }
  }

  addStep(): void {
    const step = this.fb.group({
      name: ['', Validators.required],
      user: ['', Validators.required],
      version: ['', Validators.required],
      state: ['', Validators.required]
    });
    this.steps.push(step);
  }

  removeStep(index: number): void {
    this.steps.splice(index, 1);
  }

  submit(): void {
    const updatedScenario = {
      ...this.scenario,
      steps: this.steps.map(step => step.value)
    };
    this.scenarioUpdated.emit(updatedScenario);
    this.dialogRef.close(updatedScenario);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

