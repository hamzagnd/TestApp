// /home/harun/TestApp/src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestControlComponent } from './test-control/test-control.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import {TestCaseTableComponent} from "./test-case-table/test-case-table.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'test', component: TestControlComponent, canActivate: [AuthGuard] },
  { path: 'report', component: ReportTableComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/test', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
