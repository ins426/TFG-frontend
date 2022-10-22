import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from "@angular/router";
import {DeserializeArray, IJsonArray} from "dcerialize";
import {map, Observable} from "rxjs";
import {AppointmentInterface} from "../interfaces/appointment";

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

  getAvailableStartAppointments(id_psychologist:string|null, selectedDate:string): Observable<Array<Date>> {

    let dayPsychologist = {day:selectedDate,id_psychologist:id_psychologist}
    return (this.http.post<IJsonArray>('/api/available-start-appointment',dayPsychologist).pipe(
        map((availableAppointments) => DeserializeArray(availableAppointments, () => Date))))
  }

  getAvailableEndAppointments(id_psychologist:string |null, chosenStart:Date, selectedDate:string,
                              endTime?:Date,): Observable<Array<Date>> {

    let dayPsychologist = {day:selectedDate,id_psychologist:id_psychologist,chosen_start:chosenStart, endTime}
    return (this.http.post<IJsonArray>('/api/available-end-appointment',dayPsychologist).pipe(
        map((availableAppointments) => DeserializeArray(availableAppointments, () => Date))))
  }

  postAppointment(newAppointment: AppointmentInterface): void{
    this.http.post<AppointmentInterface>('/api/appointment',newAppointment).subscribe()
  }

  modifyAppointment(updatedAppointment: AppointmentInterface,id:number):void{
    this.http.put<AppointmentInterface>('/api/appointment/'+String(id),updatedAppointment).subscribe()
  }
}
