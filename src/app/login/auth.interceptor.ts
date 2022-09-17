import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
} from '@angular/common/http';
import {catchError, Observable, throwError as observableThrowError} from 'rxjs';
import {AuthService} from "../../services/auth.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
                private cookieService: CookieService,
                private router: Router) {
    }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(httpRequest).pipe(
            catchError((error: any) => {
                if(error.status === 401){
                    this.router.navigate(['/login']);
                    this.authService.logout()
                }

                return observableThrowError(error)
            })
        )
    }
}