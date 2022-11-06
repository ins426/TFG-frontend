import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  durationInSeconds = 3;

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar():void {
    this._snackBar.open("La hora seleccionada no se encuentra disponible", undefined,{
      duration: this.durationInSeconds * 1000,
    });
  }

  openSnackBarMessage(message:string){
    this._snackBar.open(message, undefined,{
      duration: this.durationInSeconds * 1000,
    });
  }
  
  
  openSnackBarMessageObservable(message:string):Observable<void>{
    this._snackBar.open(message, undefined,{
      duration: this.durationInSeconds * 1000,
    });

    return of()
  }

}
