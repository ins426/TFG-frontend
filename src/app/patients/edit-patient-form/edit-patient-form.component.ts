import { Component, OnInit } from '@angular/core';
import {User} from "../../../models/user";
import {FormControl, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-patient-form',
  templateUrl: './edit-patient-form.component.html',
  styleUrls: ['./edit-patient-form.component.scss']
})
export class EditPatientFormComponent implements OnInit {

  user!: User
  psychologistList:User[] = []
    nameControl = new FormControl('',[Validators.required])
    surnameControl = new FormControl('',[Validators.required])
    emailControl = new FormControl('',[Validators.required])
    psychologistControl = new FormControl('',[Validators.required])

  constructor(private userService:UserService,
              public dialogRef: MatDialogRef<EditPatientFormComponent>) { }

  ngOnInit(): void {
    this.userService.getPsychologists().subscribe((psychologists) => {
      this.psychologistList = psychologists
    })
    this.nameControl.setValue(this.user!.name)
    this.surnameControl.setValue(this.user!.surname)
    this.emailControl.setValue(this.user!.email)
    this.psychologistControl.setValue(String(this.user!.psychologist!._id))
    this.emailControl.disable()
  }

  submit():void{

    if(this.nameControl.valid && this.surnameControl.valid && this.psychologistControl.valid ){
      this.userService.editPatient(this.nameControl.value!,this.surnameControl.value!,
          String(this.user.psychologist!._id),String(this.psychologistControl.value!),String(this.user._id!))

    }
  }

  close():void{
    this.dialogRef.close()
  }

}
