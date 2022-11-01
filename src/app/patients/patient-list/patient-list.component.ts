import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {CreatePatientFormComponent} from "../create-patient-form/create-patient-form.component";
import {EditPatientFormComponent} from "../edit-patient-form/edit-patient-form.component";
import {DeletePatientDialogComponent} from "../delete-patient-dialog/delete-patient-dialog.component";


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  displayedColumns: string[] = ['icon','name','surname','psychologist','operations'];
  dataSource!:MatTableDataSource<User>
  patients:User[] = []
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private userService:UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getPatients().subscribe(async (patients) => {
      this.patients = patients
      for (let i = 0; i < this.patients.length; ++i) {
          this.patients[i].psychologist = new User(undefined,"","","",[],"","","")
      }
    }).add(async () => {
      for (let i = 0; i < this.patients.length; ++i) {
        this.userService.getPatientPsychologist(this.patients[i]._id).subscribe((psychologist) => {
          this.patients[i].psychologist = psychologist
        })
      }
      this.dataSource = new MatTableDataSource(this.patients)
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Pacientes por página';
    })
  }

  openCreateDialog(){
    this.dialog.open(CreatePatientFormComponent,{
      width:'650px',
      height: '620px'
    })
  }

  openEditDialog(element:User){
    let dialogRef = this.dialog.open(EditPatientFormComponent,{
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
