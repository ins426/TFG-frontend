import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

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

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.routeActive = this.router.url
  }

  redirect(path:string){
    this.router.navigate([path])
  }
}
