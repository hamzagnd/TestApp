import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestControlComponent } from './test-control.component';

describe('TestControlComponent', () => {
  let component: TestControlComponent;
  let fixture: ComponentFixture<TestControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
