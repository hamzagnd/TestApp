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
import { HttpClientModule} from '@angular/common/http';
import { ScenarioStepperComponent } from './scenario-stepper/scenario-stepper.component';
import { UserAddComponent } from './user-add/user-add.component';

import { MatDialogModule } from '@angular/material/dialog'; 
import { AppRoutingModule } from './app-routing.module';  
import { MatPaginatorModule } from '@angular/material/paginator';
import { MenuComponent } from './menu/menu.component';
import {MatSidenavContainer} from "@angular/material/sidenav";
import {MatSidenav} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatSidenavModule} from '@angular/material/sidenav';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatMenuModule } from'@angular/material/menu';
import { MatIconModule } from'@angular/material/icon';
import {RouterModule} from "@angular/router";
import { ReportTableComponent } from './report-table/report-table.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [
    AppComponent,
    GenericTableComponent,
    TestControlComponent,
    ScenarioStepperComponent,
    UserAddComponent,
    MenuComponent,
    ReportTableComponent,

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
  ],
  providers: [
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
