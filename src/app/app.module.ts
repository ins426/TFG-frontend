import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import { LoginComponent } from './login/login.component';
import {MatFormFieldModule} from '@angular/material/form-field';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CalendarComponent,
    MainComponent,
    SideBarComponent,
      MyAngularSchedulerComponent
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
        MatChipsModule
    ],
  providers: [
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
