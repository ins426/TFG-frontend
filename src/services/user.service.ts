import { Injectable } from '@angular/core';
import {PsychologistInterface} from "../interfaces/user-interface";
import {HttpClient} from "@angular/common/http";
import {finalize, map, Observable, switchMap} from "rxjs";
import { Deserialize, DeserializeArray, IJsonArray, IJsonObject, Serialize } from 'dcerialize';
import {User} from "../models/user";
import {SnackbarService} from "./snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";
import {CreatePatientFormComponent} from "../app/patients/create-patient-form/create-patient-form.component";
import {
  CreatePsychologistFormComponent
} from "../app/psychologists/create-psychologist-form/create-psychologist-form.component";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private snackbarService:SnackbarService,
              private router:Router) { }

  getPsychologists(): Observable<Array<User>>{
    return (this.http.get<IJsonArray>('/api/psychologists').pipe(
        map((psychologists) => DeserializeArray(psychologists, () => User)))
    )
  }

  getPatients(): Observable<Array<User>>{
    return (this.http.get<IJsonArray>('/api/patients').pipe(
        map((patients) => DeserializeArray(patients, () => User)))
    )
  }

  getPatientPsychologist(id:number|undefined):Observable<User>{
    return this.http.post<User>('/api/patient-psychologist',{patientId:id})
  }

  setPassword(token: string, email:string, password: string): void{
    this.http.post('/api/activate-account',{token:token, email:email, password:password}).subscribe()
  }

  addPatient(name:string,surname:string,email:string,idPsychologist:string,rol:string,
             dialogRef: MatDialogRef<CreatePatientFormComponent>):void{
    this.http.post('/api/user',{name:name,surname:surname, email:email,rol:rol,
      idPsychologist:idPsychologist}).subscribe(
        (response)=>{
          dialogRef.close()
          this.snackbarService.openSnackBarMessage("Paciente añadido")
          location.reload()
        },
          error => {
            this.snackbarService.openSnackBarMessage("El correo electrónico introducido" +
              " ya está asociado a una cuenta")})
  }

  addPsychologist(name:string,surname:string,email:string,colorCategory:string,rol:string,
             dialogRef: MatDialogRef<CreatePsychologistFormComponent>):void{
    this.http.post('/api/user',{name:name,surname:surname, email:email,rol:rol,
      ColorCategory:colorCategory}).subscribe(
        (response)=>{
          dialogRef.close()
          this.snackbarService.openSnackBarMessage("Psicólogo añadido")
          location.reload()
        },
          error => {
            this.snackbarService.openSnackBarMessage("El correo electrónico introducido" +
              " ya está asociado a una cuenta")})
  }

  editPatient(name:string,surname:string,idOldPsychologist:string,idNewPsychologist:string,patientId:string){
    this.http.put('/api/patient',{name:name,surname:surname,oldIdPsychologist:idOldPsychologist,
    newIdPsychologist:idNewPsychologist,idPatient:patientId}).subscribe(()=>{location.reload()})
  }

  editPsychologist(name:string,surname:string,idPsychologist:string,categoryColor:string){
    this.http.put('/api/psychologist',{name:name,surname:surname,idPsychologist:idPsychologist,
    ColorCategory:categoryColor}).pipe(finalize(()=>location.reload())).subscribe()
  }

  deleteUser(id:string){
    this.http.delete('/api/user/'+id).subscribe(()=>{
          location.reload()
    })
  }

  changePassword(newPassword:string){
    this.http.put('/api/change-password',{newPassword:newPassword}).subscribe(()=>{
      localStorage.removeItem('userData')
      location.reload()
    })
  }

  getPassword(email:string){
    this.http.put('/api/forget-password',{email:email}).subscribe(()=>{
      this.router.navigateByUrl('/login')
    })
  }
}
