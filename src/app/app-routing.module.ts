import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ActiveSessionGuard} from "./login/active-session-guard";
import {AuthGuard} from "./login/auth-guard";
import {MainComponent} from "./main/main.component";
import {CalendarComponent} from "./calendar/calendar.component";

const routes: Routes = [
    {
    path: ' ',
    component: MainComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
      children: [
        {path: '', pathMatch:'full', redirectTo:"/calendario"},
        {
          path:'calendario',
          component: CalendarComponent
        }
      ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ActiveSessionGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
