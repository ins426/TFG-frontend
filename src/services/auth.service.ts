import { Injectable } from '@angular/core';
import {LoginUserInterface, JwtResponse, UserProfile} from "../interfaces/user-interface";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, throwError} from "rxjs";
import {CanActivate, Router} from "@angular/router";
import {SnackbarService} from "./snackbar.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  userProfile: BehaviorSubject<UserProfile> = new BehaviorSubject<UserProfile>({
    'email': '',
    'name': '',
    'id': -1
  })

  public redirectUrl?: string

  constructor(
      private http: HttpClient,
      private router: Router,
      private snackbarService:SnackbarService
  ) { }

  login(credentials: LoginUserInterface){
    this.http.post<UserProfile>('/api/login',credentials).pipe(
        catchError(():any=>{
           this.snackbarService.openSnackBarMessage("Credenciales incorrectas")
          return this.handleError
        })
    ).subscribe(response => {
      localStorage.setItem('userData',JSON.stringify(response))
      this.router.navigateByUrl(<string>this.redirectUrl)
      this.redirectUrl = ''
    })
  }

  handleError(error: HttpErrorResponse) {
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Incorrect credentials'));
  }

  logout(){
    window.localStorage.removeItem('userData')
  }

  checkToken(token:string){
    this.http.post('/api/check-token',{token:token}).subscribe(response =>{
      localStorage.setItem('userData',JSON.stringify(response))
    })
  }


  loadUserFromLocalStorage():UserProfile {
    if(this.userProfile.value.id == -1){
      let fromLocalStorage = localStorage.getItem('userData')
      if(fromLocalStorage){
        let userInfo = JSON.parse(fromLocalStorage)
        this.userProfile.next(userInfo)
      }
    }
    return this.userProfile.value
  }

}
