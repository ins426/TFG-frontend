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
import {UserService} from "../../services/user.service";
import {PsychologistInterface} from "../../interfaces/user-interface";
import {cookieServiceFactory} from "ngx-cookie";
import {finalize, map, Observable, startWith, switchMap, tap} from "rxjs";
import {User} from "../../models/user";

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
export class MyAngularSchedulerComponent implements OnInit{
  public workWeekDays: number[] = [1, 2,3,4,5];
  today = new Date()
  public minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  public myselectedDate:Date = new Date(Date.now())

  @ViewChild('scheduleObj') calendar!: ScheduleComponent;

  public startDate: Date | undefined;
  public endDate: Date | undefined;

  public setViews: View[] = ['Day', 'Month', 'WorkWeek']

  public psychologistControl = new FormControl('')
  public startTimeControl = new FormControl('')
  public endTimeControl = new FormControl('')

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

  availableHours: Date[] = []

  psychologistList!: User[]
  availableStartAppointments!:Date[]
  availableEndAppointments!:Date[]

  selectedStartTime!:Date
  selectedEndTime!:Date
  selectedPsychologist!:string

  constructor(private http: HttpClient, public appointmentService: AppointmentService,
              public userService: UserService) {}



  ngOnInit(): void {
    //TODO Aqui segun el rol del usuario se obtendran todos los psicologos, el psicologo que es o el psicologo del paciente
    //Get psychologist list
    this.userService.getPsychologists().subscribe((psychologists) => {
      this.psychologistList = psychologists
    })

    //Get all appointments according to a role
    this.appointmentService.getAppointments().subscribe((response: any) => {
      let records: Record<string, any>[] = []
      response.forEach((appointment: any) => records.push(appointment));
      this.eventSettings = {dataSource: records}
    })

    this.psychologistControl.valueChanges.pipe(
        startWith(this.psychologistControl.value),
        switchMap((psychologist)=>
          //Get available appointments from selected psychologist in the chosen day
         this. getAvailableStartHours(psychologist).pipe()
        )
    ).subscribe((availableHours)=>{
      if(this.psychologistControl.value){
        this.availableStartAppointments = availableHours
      }
    })

    this.startTimeControl.valueChanges.pipe(
        startWith(this.startTimeControl.value)
    )
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

  public onPopupOpen(args: { type: string; data: { Patient: any, StartTime: Date }; }) {
    //Adjust so the value is the correspondent
    //let fecha = String(args.data.StartTime)
    this.startTimeControl.setValue(args.data.StartTime.toLocaleTimeString())
    this.psychologistControl.setValue(String(this.psychologistList[0]._id))
    this.handleStartTimeClick(args.data.StartTime)
    //this.selectedStartTime = args.data.StartTime

    if (args.type === 'Editor') {
      //Args data son los datos del evento
      //this.control.setValue(args.data.Patient);
    }
  }

  public onPopupClose(args:any) {
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

  getAvailableStartHours(psychologist:string |null): Observable<Array<Date>>{
    return this.appointmentService.getAvailableStartAppointments(psychologist)
  }

  getAvailableEndHours(psychologist:string |null,chosenStart:Date): Observable<Array<Date>>{
    return this.appointmentService.getAvailableEndAppointments(psychologist,chosenStart)
  }

  handleStartTimeClick(startTime:Date){
    this.selectedStartTime = startTime

    this.getAvailableEndHours(this.psychologistControl.value,this.selectedStartTime).subscribe((availableEndTimes)=>{
      this.availableEndAppointments = availableEndTimes
    })
  }

  handleEndTimeClick(endTime:Date){
    this.selectedEndTime = endTime
  }

  displayFn(value?: number):string {

    if(value){
      let name = this.psychologistList.find(psychologist => psychologist._id === value)!.name
      let surname = this.psychologistList.find(psychologist => psychologist._id === value)!.surname

      return name+" "+surname
    }else{
      return ""
    }
  }

  display(date:Date|null){
    return date?.toLocaleTimeString()
  }

}
