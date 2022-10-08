import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {CanActivate, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(
      private http: HttpClient,
      private router: Router) { }

  getAppointments(): any{
    return this.http.get('/api/appointment')
  }
}
