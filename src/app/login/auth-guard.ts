import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService} from "../../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, {url}: RouterStateSnapshot
    ): boolean{
        let userLogged = false
        //TO-DO Change this to cookies
        if(localStorage.getItem('userData')){
            userLogged = true
        }else{
            this.authService.redirectUrl = url
            this.router.navigateByUrl('/login')
        }
        return userLogged
    }
}