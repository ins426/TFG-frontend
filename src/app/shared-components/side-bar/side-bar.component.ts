import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {
  DeletePsychologistDialogComponent
} from "../../psychologists/delete-psychologist-dialog/delete-psychologist-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ProfileComponent} from "../../profile/profile.component";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  sideBarElements = [
    {
      'name': 'Calendario',
      'route': '/calendario',
      'accesible': ['administrador','psicologo','paciente'],
      'icon': 'assets/images/calendar.png'
    },
    {
      'name': 'Pacientes',
      'route': '/pacientes',
      'accesible': ['administrador'],
      'icon': 'assets/images/pacients.png'
    },
    {
      'name': 'Psicólogos',
      'route': '/psicologos',
      'accesible': ['administrador'],
      'icon': 'assets/images/heart.png'
    },
    {
      'name': 'Perfil',
      'route': '/perfil',
      'accesible': ['administrador','psicologo','paciente'],
      'icon': 'assets/images/profile.png'
    },
  ]

  routeActive:string = ''
  userRole = ''
  constructor(public router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.routeActive = this.router.url
    this.userRole = JSON.parse(localStorage.getItem('userData')!)['rol']
  }

  canDisplay(allowedRoles:String[]):boolean{
    for(let i =0; i < allowedRoles.length; ++i){
      if(allowedRoles[i] == this.userRole){
        return true
      }
    }
    return false
  }

  async redirect(path: string) {

    if(path != '/perfil'){
      await this.router.navigate([path])
      this.routeActive = this.router.url
    }else{
      let dialogRef = this.dialog.open(ProfileComponent,{
        width:'750px',
        height: '650px'
      })
    }
  }

  logout(){
    localStorage.removeItem('userData')
    location.reload()
  }
}
