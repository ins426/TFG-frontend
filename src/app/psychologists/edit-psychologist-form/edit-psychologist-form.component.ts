import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../models/user";
import {FormControl, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {MatDialogRef} from "@angular/material/dialog";
import { NgxMatColorPickerInput, Color } from '@angular-material-components/color-picker';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-edit-psychologist-form',
  templateUrl: './edit-psychologist-form.component.html',
  styleUrls: ['./edit-psychologist-form.component.scss']
})
export class EditPsychologistFormComponent implements OnInit, AfterViewInit {

  user!: User
  @ViewChild(NgxMatColorPickerInput) pickerInput!: NgxMatColorPickerInput;
  psychologistList:User[] = []
    nameControl = new FormControl('',[Validators.required])
    surnameControl = new FormControl('',[Validators.required])
    emailControl = new FormControl('',[Validators.required])
    colorControl = new FormControl('',[Validators.required])

  constructor(private userService:UserService,
              public dialogRef: MatDialogRef<EditPsychologistFormComponent>,
              private cdRef:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userService.getPsychologists().subscribe((psychologists) => {
      this.psychologistList = psychologists
    })
    this.nameControl.setValue(this.user!.name)
    this.surnameControl.setValue(this.user!.surname)
    this.emailControl.setValue(this.user!.email)
    this.emailControl.disable()
  }

  ngAfterViewInit(): void {
    this.colorControl.setValue(this.user.CategoryColor!)
    const temp = this.hexToRgb(this.user!.CategoryColor);
    this.pickerInput.value = new Color(temp!.r, temp!.g, temp!.b);
    this.cdRef.detectChanges();
  }

  submit():void{
    if(this.nameControl.valid && this.surnameControl.valid && this.colorControl.valid ) {
      let color = this.colorControl.value!
      this.userService.editPsychologist(this.nameControl.value!,this.surnameControl.value!,String(this.user._id),
          color)
    }
  }

  close():void{
    this.dialogRef.close()
  }

  hexToRgb(hex:string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

}
