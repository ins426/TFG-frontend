import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  name:string = ''
  surname:string = ''
  role:string = ''
  email:string = ''


  passwordControl =  new FormControl('',[Validators.required, Validators.email])
  repeatPasswordControl =  new FormControl('',Validators.required)

  constructor(private snackbarService: SnackbarService, private userService:UserService,
              public dialogRef: MatDialogRef<ProfileComponent>) { }

  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData')!)
    this.name = userData['name']
    this.surname = userData['surname']
    this.role = userData['rol'].charAt(0).toUpperCase() + userData['rol'].slice(1)
    this.email = userData['email']
  }

  changePassword():void{
    if(this.repeatPasswordControl.valid && this.repeatPasswordControl.valid){
      if(this.repeatPasswordControl.value != this.passwordControl.value){
        this.snackbarService.openSnackBarMessage("Las contraseñas no coinciden")
      }else{
        this.userService.changePassword(this.passwordControl.value!)
      }
    }
  }

  close():void{
    this.dialogRef.close()
  }

}
