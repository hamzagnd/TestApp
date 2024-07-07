import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-scenario-stepper',
  templateUrl: './scenario-stepper.component.html',
  styleUrls: ['./scenario-stepper.component.css']
})
export class ScenarioStepperComponent implements OnInit {
  @Input() scenario: any;
  @Output() scenarioUpdated = new EventEmitter<any>();

  step1: FormGroup;
  step2: FormGroup;
  step3: FormGroup;

  constructor(private fb: FormBuilder) {
    this.step1 = this.fb.group({
      name: ['', Validators.required]
    });
    this.step2 = this.fb.group({
      user: ['', Validators.required]
    });
    this.step3 = this.fb.group({
      version: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.scenario) {
      this.step1.patchValue({ name: this.scenario.name });
      this.step2.patchValue({ user: this.scenario.user });
      this.step3.patchValue({
        version: this.scenario.version,
        state: this.scenario.state
      });
    }
  }

  submitStep1(): void {
    console.log('Step 1 submitted');
  }

  submitStep2(): void {
    console.log('Step 2 submitted');
  }

  submitStep3(): void {
    console.log('Step 3 submitted');
  }

  submit(): void {
    const updatedScenario = {
      ...this.scenario,
      ...this.step1.value,
      ...this.step2.value,
      ...this.step3.value
    };
    this.scenarioUpdated.emit(updatedScenario);
  }
}
