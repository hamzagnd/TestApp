// /home/harun/TestApp/src/app/scenario-stepper/scenario-stepper.component.ts
import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScenarioService } from '../scenario.service';

@Component({
  selector: 'app-scenario-stepper',
  templateUrl: './scenario-stepper.component.html',
  styleUrls: ['./scenario-stepper.component.css']
})
export class ScenarioStepperComponent implements OnInit {
  @Input() scenario: any;
  @Output() scenarioUpdated = new EventEmitter<any>();

  steps: FormGroup[] = [];
  existingSteps: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScenarioStepperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private scenarioService: ScenarioService
  ) {
    if (data) {
      this.scenario = data.scenario;
    }
  }

  ngOnInit(): void {
    if (this.scenario) {
      this.loadSteps();
      this.addStep();
    }
  }

  loadSteps(): void {
    this.scenarioService.getSteps(this.scenario.id).subscribe(steps => {
      this.existingSteps = steps;
      steps.forEach(step => this.addStep(step));
    });
  }

  addStep(stepData: any = null): void {
    const step = this.fb.group({
      category: [stepData ? stepData.category : '', Validators.required],
      success_criteria: [stepData ? stepData.success_criteria : '', Validators.required]
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
    this.scenarioService.updateScenario(updatedScenario).subscribe(() => {
      this.scenarioUpdated.emit(updatedScenario);
      this.dialogRef.close(updatedScenario);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
