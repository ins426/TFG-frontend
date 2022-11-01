import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../models/user";
import {MatPaginator} from "@angular/material/paginator";
import {UserService} from "../../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {CreatePatientFormComponent} from "../../patients/create-patient-form/create-patient-form.component";
import {EditPatientFormComponent} from "../../patients/edit-patient-form/edit-patient-form.component";
import {DeletePatientDialogComponent} from "../../patients/delete-patient-dialog/delete-patient-dialog.component";
import {CreatePsychologistFormComponent} from "../create-psychologist-form/create-psychologist-form.component";
import {EditPsychologistFormComponent} from "../edit-psychologist-form/edit-psychologist-form.component";

@Component({
  selector: 'app-psychologist-list',
  templateUrl: './psychologist-list.component.html',
  styleUrls: ['./psychologist-list.component.scss']
})
export class PsychologistListComponent implements OnInit {
  displayedColumns: string[] = ['icon','name','surname','operations'];
  dataSource!:MatTableDataSource<User>
  psychologists:User[] = []
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private userService:UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getPsychologists().subscribe( (psychologists) => {
      this.psychologists = psychologists
    }).add(()=>{
      this.dataSource = new MatTableDataSource(this.psychologists)
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Psicólogos por página';
    })
    }

  openCreateDialog(){
    this.dialog.open(CreatePsychologistFormComponent,{
      width:'650px',
      height: '620px'
    })
  }

  openEditDialog(element:User){
    let dialogRef = this.dialog.open(EditPsychologistFormComponent,{
      width:'650px',
      height: '620px'
    })

    let instance = dialogRef.componentInstance
    instance.user = element
  }

  openDeleteDialog(element:User){
    let dialogRef = this.dialog.open(DeletePatientDialogComponent,{
      width:'500px',
      height: '250px'
    })

    let instance = dialogRef.componentInstance
    instance.user = element
  }

}
