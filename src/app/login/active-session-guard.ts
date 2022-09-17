import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Injectable()
export class ActiveSessionGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    public canActivate(_route: ActivatedRouteSnapshot): boolean {
        if (localStorage.getItem('userData')) {
            this.router.navigate(['/']);
        }else{
            console.log("adios")
        }
        return true;
    }
}
