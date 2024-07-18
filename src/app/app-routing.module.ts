import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestControlComponent } from './test-control/test-control.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';  // Import the menu component
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'test', component: TestControlComponent, canActivate: [AuthGuard] },
  { path: 'report', component: ReportTableComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },  // Menu component as the home page
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
