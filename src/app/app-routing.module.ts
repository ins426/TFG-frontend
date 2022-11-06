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
import {RoleGuard} from "./login/role.guard";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {RecoverPasswordComponent} from "./recover-password/recover-password.component";

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
          component: CalendarComponent,
            canActivate: [RoleGuard],
            data: {
                roles: ['administrador','psicologo','paciente']
            },
        },
          {
              path:'pacientes',
              component:PatientListComponent,
              canActivate: [RoleGuard],
              data: {
                roles: ['administrador']
              },
          },
          {
              path:'psicologos',
              component:PsychologistListComponent,
              canActivate: [RoleGuard],
              data: {
                roles: ['administrador']
              },
          }
      ]
    },
    {
    path: 'login',
    component: LoginComponent,
    canActivate: [ActiveSessionGuard],
    },
    {
        path:'olvidar-contrasenia',
        component:ForgotPasswordComponent,
        canActivate: [ActiveSessionGuard],
    },
    {
        path:'activar-cuenta',
        component: ActivateAccountComponent
    },
    {
        path:'restablecer-contrasenia',
        component: RecoverPasswordComponent
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
