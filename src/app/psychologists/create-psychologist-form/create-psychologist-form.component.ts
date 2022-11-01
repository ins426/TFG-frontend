import { Component, OnInit } from '@angular/core';
import {User} from "../../../models/user";
import {FormControl, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-psychologist-form',
  templateUrl: './create-psychologist-form.component.html',
  styleUrls: ['./create-psychologist-form.component.scss']
})
export class CreatePsychologistFormComponent implements OnInit {

  psychologistList:User[] = []
    nameControl = new FormControl('',[Validators.required])
    surnameControl = new FormControl('',[Validators.required])
    emailControl = new FormControl('',[Validators.required])
    colorControl = new FormControl('',[Validators.required])

  constructor(private userService:UserService,
              public dialogRef: MatDialogRef<CreatePsychologistFormComponent>) { }

  ngOnInit(): void {
    this.userService.getPsychologists().subscribe((psychologists) => {
      this.psychologistList = psychologists
    })
  }

  submit():void{
    if(this.nameControl.valid && this.surnameControl.valid && this.emailControl.valid && this.colorControl.valid ) {
      this.userService.addPsychologist(this.nameControl.value!,this.surnameControl.value!,this.emailControl.value!,
          this.colorControl.value!,'psicologo',this.dialogRef!)
    }
  }

  close():void{
    this.dialogRef.close()
  }

}
