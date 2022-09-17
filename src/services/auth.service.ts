import { Injectable } from '@angular/core';
import {LoginUserInterface, JwtResponse, UserProfile} from "../interfaces/user-interface";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {BehaviorSubject, Observable} from "rxjs";
import {CanActivate, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  userProfile: BehaviorSubject<UserProfile> = new BehaviorSubject<UserProfile>({
    'email': '',
    'name': '',
    'id': -1
  })

  public redirectUrl : string

  constructor(
      private http: HttpClient,
      private router: Router
  ) { }

  login(credentials: LoginUserInterface){
    this.http.post<UserProfile>('/api/login',credentials).subscribe(response => {
      localStorage.setItem('userData',JSON.stringify(response))
      this.router.navigateByUrl(this.redirectUrl)
      this.redirectUrl = ''
    })
  }

  logout(){
    window.localStorage.removeItem('userData')
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
