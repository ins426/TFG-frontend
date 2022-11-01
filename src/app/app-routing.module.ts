import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ActiveSessionGuard} from "./login/active-session-guard";
import {AuthGuard} from "./login/auth-guard";
import {MainComponent} from "./main/main.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {MyAngularSchedulerComponent} from "./my-angular-scheduler/my-angular-scheduler.component";
import {ActivateAccountComponent} from "./activate-account/activate-account.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {PatientListComponent} from "./patients/patient-list/patient-list.component";
import {PsychologistListComponent} from "./psychologists/psychologist-list/psychologist-list.component";

const routes: Routes = [
    {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
      children: [
        {path: '', pathMatch:'full', redirectTo:"/calendario"},
        {
          path:'calendario',
          component: CalendarComponent
        },
          {
              path:'pacientes',
              component:PatientListComponent
          },
          {
              path:'psicologos',
              component:PsychologistListComponent
          }
      ]
    },
    {
    path: 'login',
    component: LoginComponent,
    canActivate: [ActiveSessionGuard]
    },
    {
        path:'activar-cuenta',
        component: ActivateAccountComponent
    },
    {
        path: '**',
        pathMatch: 'full',
        component: PageNotFoundComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
