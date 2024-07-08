import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { TestControlComponent } from './test-control/test-control.component';
import { HttpClientModule } from '@angular/common/http';
import { ScenarioStepperComponent } from './scenario-stepper/scenario-stepper.component';
import { UserAddComponent } from './user-add/user-add.component';
import { MatDialogModule } from '@angular/material/dialog'; // Dialog modülü eklendi

@NgModule({
  declarations: [
    AppComponent,
    GenericTableComponent,
    TestControlComponent,
    ScenarioStepperComponent,
    UserAddComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatStepperModule,
    MatExpansionModule,
    HttpClientModule,
    MatDialogModule // Dialog modülü eklendi
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
