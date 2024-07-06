import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'; // provideHttpClient ve withFetch import edildi
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { TestControlComponent } from './test-control/test-control.component';

@NgModule({
  declarations: [
    AppComponent,
    GenericTableComponent,
    TestControlComponent,
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
    MatTabsModule,
    MatStepperModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withFetch()) // HttpClient ve fetch özelliği sağlandı
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
