import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  CellClickEventArgs, DragEventArgs,
  ScheduleComponent, View, WorkHoursModel
} from '@syncfusion/ej2-angular-schedule';
import {L10n} from '@syncfusion/ej2-base';
import { loadCldr} from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { doctorsEventData } from '../data';
import {MonthService, DayService, WeekService, EventSettingsModel, WorkWeekService,
DragAndDropService} from '@syncfusion/ej2-angular-schedule';
import { ChangeEventArgs } from '@syncfusion/ej2-calendars';
import {FormControl} from "@angular/forms";
import {AppointmentService} from "../../services/appointment.service";

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
      workWeek: 'Semana',
      month: 'Mes',
      today: 'Hoy',
      save: 'Guardar',
      saveButton: 'Guardar',
      cancelButton: 'Cancelar'
    }
  }
});

@Component({
  selector: 'app-my-angular-scheduler',
  providers: [DayService, WeekService,MonthService, WorkWeekService, DragAndDropService],
  templateUrl: './my-angular-scheduler.component.html',
  styleUrls: ['./my-angular-scheduler.component.scss']
})
export class MyAngularSchedulerComponent implements OnInit {
  public workWeekDays: number[] = [1, 2,3,4,5,6,7];

  public myselectedDate:Date = new Date(Date.now())

  @ViewChild('scheduleObj') calendar!: ScheduleComponent;

  public startDate: Date | undefined;
  public endDate: Date | undefined;

  public setViews: View[] = ['Day', 'Month', 'WorkWeek']

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

  public eventSettings?: EventSettingsModel

  constructor(private http: HttpClient,
              public appointmentService: AppointmentService) {

  }



  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe((response: any) => {
      let records: Record<string, any>[] = []

      response.forEach((appointment:any) => records.push(appointment));
      console.log(response)
      this.eventSettings =  {dataSource:records }
    })
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
      console.log(args)
    if (args.type === 'Editor') {
      //Args data son los datos del evento
      //this.control.setValue(args.data.Patient);
    }
  }

  public onPopupClose(args:any) {
      console.log(args)
    if (args.type === 'Editor' && args.data) {
      //args.data.Patient = this.patient;
    }
    this.startDate = undefined;
    this.endDate = undefined;
  }

  keyEvent(mat:any) {
    this.patient = mat.option.value;
  }

  onCellClick(args: CellClickEventArgs): void {
    this.calendar.openEditor(args, 'Add');
    }

  onDragStart(args: DragEventArgs): void {
      args.interval = 10; // drag interval time is changed to 10 minutes
  }

}
