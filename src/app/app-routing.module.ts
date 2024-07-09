import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestControlComponent } from './test-control/test-control.component';
import { UserAddComponent } from './user-add/user-add.component';
import { ScenarioStepperComponent } from './scenario-stepper/scenario-stepper.component';

const routes: Routes = [
  { path: 'test-control', component: TestControlComponent },
  { path: 'user-add', component: UserAddComponent },
  { path: 'scenario-stepper', component: ScenarioStepperComponent },
  { path: '', redirectTo: '/test-control', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
