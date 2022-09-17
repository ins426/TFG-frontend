import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import { LoginComponent } from './login/login.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HomeComponent } from './home/home.component';
import {ActiveSessionGuard} from "./login/active-session-guard";
import {AuthGuard} from "./login/auth-guard";
import {CookieService} from "ngx-cookie-service";
import {AuthInterceptor} from "./login/auth.interceptor";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FlexModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatInputModule
    ],
  providers: [
      ActiveSessionGuard,
      AuthGuard,
      CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
