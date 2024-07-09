import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestControlComponent } from './test-control/test-control.component';
import { ReportTableComponent } from './report-table/report-table.component';

const routes: Routes = [
  { path: 'test', component: TestControlComponent },
  { path: 'report', component: ReportTableComponent },
  { path: '', redirectTo: '/test', pathMatch: 'full' } // Varsayılan olarak test yönlendirmesi
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
