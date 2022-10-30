import { Injectable } from '@angular/core';
import {PsychologistInterface} from "../interfaces/user-interface";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import { Deserialize, DeserializeArray, IJsonArray, IJsonObject, Serialize } from 'dcerialize';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

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
}
