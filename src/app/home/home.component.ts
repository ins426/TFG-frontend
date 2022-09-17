import { Component, OnInit } from '@angular/core';
import {UserProfile} from "../../interfaces/user-interface";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient,) { }

  ngOnInit(): void {
  }

  sendSomething():void{
    this.http.get('/api/refresh-token').subscribe()
  }

}
