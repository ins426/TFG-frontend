import { Component, OnInit } from '@angular/core';
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-psychologist-dialog',
  templateUrl: './delete-psychologist-dialog.component.html',
  styleUrls: ['./delete-psychologist-dialog.component.scss']
})
export class DeletePsychologistDialogComponent implements OnInit {

  user!:User

  constructor(private userService:UserService,
              public dialogRef: MatDialogRef<DeletePsychologistDialogComponent>) { }

  ngOnInit(): void {
  }

  delete(){
    this.userService.deleteUser(String(this.user._id))
  }

  close(){
    this.dialogRef.close()
  }

}
