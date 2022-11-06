import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router:Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles:string[] = route.data['roles']
    let canActivate = false

    const userRole = JSON.parse(localStorage.getItem('userData')!)['rol']

    for(let i = 0; i < allowedRoles.length; ++i){
      if(allowedRoles[i] == userRole){
        canActivate = true
      }
    }

    if(!canActivate){
      this.router.navigate(['/404'])
    }

    return canActivate;
  }
  
}
