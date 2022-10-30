import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

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

}
