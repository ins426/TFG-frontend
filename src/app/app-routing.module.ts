import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ActiveSessionGuard} from "./login/active-session-guard";
import {AuthGuard} from "./login/auth-guard";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ActiveSessionGuard]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
