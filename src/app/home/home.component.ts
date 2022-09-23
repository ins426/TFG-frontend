import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ScheduleComponent, View
} from '@syncfusion/ej2-angular-schedule';
import {L10n} from '@syncfusion/ej2-base';
import { loadCldr} from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { doctorsEventData } from '../data';
import {
   MonthService, DayService, WeekService,
  WorkWeekService, EventSettingsModel, ResizeService, DragAndDropService, ActionEventArgs
} from '@syncfusion/ej2-angular-schedule';
import { ChangeEventArgs } from '@syncfusion/ej2-calendars';
import {FormControl} from "@angular/forms";

declare var require: any;

loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/es/ca-gregorian.json'),
    require('cldr-data/main/es/numbers.json'),
    require('cldr-data/main/es/timeZoneNames.json')
);

L10n.load({
  'es': {
    schedule: {
      newEvent: 'Añadir cita',
      editEvent: 'Editar cita',
      day: 'Hoy',
      week: 'Semana',
      month: 'Mes',
      today: 'Hoy',
      save: 'Guardar',
      saveButton: 'Guardar',
      cancelButton: 'Cancelar'
    }
  }
});

@Component({
  selector: 'app-home',
  providers: [DayService, WeekService,MonthService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('calendar') calendar: ScheduleComponent;
  public startDate: Date | undefined;
  public endDate: Date | undefined;

  public selectedDate: Date = new Date(2021, 1, 15);
  public eventSettings: EventSettingsModel

  public setViews: View[] = ['Day', 'Month', 'Week']

  public control = new FormControl('');
  public patient: string = '';
  public samplePatients = [
    {
      'name':'Nancy'
    },
    {
      'name':'Manolo'
    }
  ]
  constructor(private http: HttpClient,) { }



  ngOnInit(): void {
    this.eventSettings = {
      dataSource: extend([], doctorsEventData, undefined, true) as Record<string, any>[]};
  }


  ngAfterViewInit(){

  }

  // @ts-ignore
  public startDateParser(data: string) {
    // @ts-ignore
    if (isNullOrUndefined(this.startDate) && !isNullOrUndefined(data)) {
      return new Date(data);
    } else { // @ts-ignore
      if (!isNullOrUndefined(this.startDate)) {
            // @ts-ignore
            return new Date(this.startDate);
          }
    }
  }
  // @ts-ignore
  public endDateParser(data: string) {
    // @ts-ignore
    if (isNullOrUndefined(this.endDate) && !isNullOrUndefined(data)) {
      return new Date(data);
    } else { // @ts-ignore
      if (!isNullOrUndefined(this.endDate)) {
            // @ts-ignore
            return new Date(this.endDate);
          }
    }
  }

  public onDateChange(args: ChangeEventArgs): void {
    // @ts-ignore
    if (!isNullOrUndefined(args.event)) {
      if (args.element.id === "StartTime") {
        this.startDate = args.value;
      } else if (args.element.id === "EndTime") {
        this.endDate = args.value;
      }
    }
  }

  public onPopupOpen(args: { type: string; data: { Patient: any; }; }) {
    if (args.type === 'Editor') {
      //Args data son los datos del evento
      console.log(args.data)
      //this.control.setValue(args.data.Patient);
    }
  }

  public onPopupClose(args:any) {
    if (args.type === 'Editor' && args.data) {
      console.log(this.patient)
      //args.data.Patient = this.patient;
      console.log(args.data)
    }
    this.startDate = undefined;
    this.endDate = undefined;
  }

  keyEvent(mat:any) {
    this.patient = mat.option.value;
  }



}
