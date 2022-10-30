import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild('drawer') public drawer?: MatDrawer;
  @ViewChild('drawercontainer') public drawercontainer?: MatDrawer;

  constructor() { }

  ngOnInit(): void {
  }

  close(){
    this.drawercontainer?.close()
  }

}
