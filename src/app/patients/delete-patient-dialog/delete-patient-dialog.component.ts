import { Component, OnInit } from '@angular/core';
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-patient-dialog',
  templateUrl: './delete-patient-dialog.component.html',
  styleUrls: ['./delete-patient-dialog.component.scss']
})
export class DeletePatientDialogComponent implements OnInit {

  user!:User

  constructor(private userService:UserService,
              public dialogRef: MatDialogRef<DeletePatientDialogComponent>) { }

  ngOnInit(): void {
  }

  delete(){
    this.userService.deleteUser(String(this.user._id))
  }

  close(){
    this.dialogRef.close()
  }
}
