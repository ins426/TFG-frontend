import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import { LoginComponent } from './login/login.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {ActiveSessionGuard} from "./login/active-session-guard";
import {AuthGuard} from "./login/auth-guard";
import {CookieService} from "ngx-cookie-service";
import {AuthInterceptor} from "./login/auth.interceptor";
import {MatInputModule} from "@angular/material/input";
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import {DropDownListModule} from '@syncfusion/ej2-angular-dropdowns'
import {DateTimePickerModule} from '@syncfusion/ej2-angular-calendars'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './calendar/calendar.component';
import { MainComponent } from './main/main.component';
import { SideBarComponent } from '../shared-components/side-bar/side-bar.component';
import {MyAngularSchedulerComponent} from "./my-angular-scheduler/my-angular-scheduler.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from "@angular/material/card";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { TimePipe } from './time.pipe';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PatientListComponent } from './patients/patient-list/patient-list.component';
import {MatTableModule} from "@angular/material/table";
import { MatPaginatorModule} from "@angular/material/paginator";
import { CreatePatientFormComponent } from './patients/create-patient-form/create-patient-form.component';
import {MatDialogModule} from '@angular/material/dialog';
import { EditPatientFormComponent } from './patients/edit-patient-form/edit-patient-form.component';
import { DeletePatientDialogComponent } from './patients/delete-patient-dialog/delete-patient-dialog.component';
import { PsychologistListComponent } from './psychologists/psychologist-list/psychologist-list.component';
import {MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS} from "@angular-material-components/color-picker";
import { CreatePsychologistFormComponent } from './psychologists/create-psychologist-form/create-psychologist-form.component';
import { EditPsychologistFormComponent } from './psychologists/edit-psychologist-form/edit-psychologist-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CalendarComponent,
    MainComponent,
    SideBarComponent,
      MyAngularSchedulerComponent,
      TimePipe,
      ActivateAccountComponent,
      PageNotFoundComponent,
      PatientListComponent,
      CreatePatientFormComponent,
      EditPatientFormComponent,
      DeletePatientDialogComponent,
      PsychologistListComponent,
      CreatePsychologistFormComponent,
      EditPsychologistFormComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FlexModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatInputModule,
        ScheduleModule,
        DateTimePickerModule,
        DropDownListModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatSelectModule,
        MatChipsModule,
        MatCardModule,
        MatSnackBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        NgxMatColorPickerModule
    ],
  providers: [
      { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
      ActiveSessionGuard,
      AuthGuard,
      CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
      MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
