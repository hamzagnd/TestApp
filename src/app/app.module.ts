import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { TestControlComponent } from './test-control/test-control.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ScenarioStepperComponent } from './scenario-stepper/scenario-stepper.component';
import { UserAddComponent } from './user-add/user-add.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MenuComponent } from './menu/menu.component';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ReportTableComponent } from './report-table/report-table.component';
import { UsersComponent } from './users/users.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ViewEncapsulation } from '@angular/core'; 


import { UserPermissionsComponent } from './user-permissions/user-permissions.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select'; 
import { MatRadioModule } from '@angular/material/radio';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';


import {ColumnTemplateDirective} from "./ColumnTemplateDirective";
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserChangePasswordComponent } from './user-change-password/user-change-password.component';
import { StepFormComponent } from './step-form/step-form.component';
import { ExcelUploadComponent } from './excel-upload/excel-upload.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    GenericTableComponent,
    TestControlComponent,
    ScenarioStepperComponent,
    UserAddComponent,
    MenuComponent,
    ReportTableComponent,
    UsersComponent,
    UserPermissionsComponent,
    LoginComponent,
    EditDialogComponent,
    ConfirmDialogComponent,
    UserEditComponent,
    UserChangePasswordComponent,
    StepFormComponent,
    ExcelUploadComponent,




  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatStepperModule,
    MatExpansionModule,
    HttpClientModule,
    MatDialogModule,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatToolbar,
    MatListItem,
    MatIcon,
    MatCardModule,
    AppRoutingModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    NgxChartsModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSelectModule, 
    MatRadioModule,
    MatSnackBarModule,

    ColumnTemplateDirective,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8000'],
        disallowedRoutes: ['http://localhost:8000/api/login/']
      }
    })
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
