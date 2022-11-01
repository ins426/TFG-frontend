import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-patient-form',
  templateUrl: './create-patient-form.component.html',
  styleUrls: ['./create-patient-form.component.scss']
})
export class CreatePatientFormComponent implements OnInit {

  psychologistList:User[] = []
    nameControl = new FormControl('',[Validators.required])
    surnameControl = new FormControl('',[Validators.required])
    emailControl = new FormControl('',[Validators.required])
    psychologistControl = new FormControl('',[Validators.required])

  constructor(private userService:UserService,
              public dialogRef: MatDialogRef<CreatePatientFormComponent>) { }

  ngOnInit(): void {
    this.userService.getPsychologists().subscribe((psychologists) => {
      this.psychologistList = psychologists
    })
  }

  submit():void{
    if(this.nameControl.valid && this.surnameControl.valid && this.emailControl.valid && this.psychologistControl.valid ){
      this.userService.addPatient(this.nameControl.value!,
          this.surnameControl.value!, this.emailControl.value!,
          this.psychologistControl.value!,'paciente',this.dialogRef)
    }
  }

  close():void{
    this.dialogRef.close()
  }

}
