import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioStepperComponent } from './scenario-stepper.component';

describe('ScenarioStepperComponent', () => {
  let component: ScenarioStepperComponent;
  let fixture: ComponentFixture<ScenarioStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScenarioStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenarioStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
