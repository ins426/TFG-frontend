import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  CellClickEventArgs, DragEventArgs,
  ScheduleComponent, View
} from '@syncfusion/ej2-angular-schedule';
import {L10n} from '@syncfusion/ej2-base';
import { loadCldr} from '@syncfusion/ej2-base';
import {MonthService, DayService, WeekService, EventSettingsModel, WorkWeekService,
DragAndDropService} from '@syncfusion/ej2-angular-schedule';
import {FormControl} from "@angular/forms";
import {AppointmentService} from "../../services/appointment.service";
import {UserService} from "../../services/user.service";
import {Observable, startWith, switchMap} from "rxjs";
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
  public workWeekDays: number[] = [1,2,3,4,5];
  today = new Date()
  public minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  public mySelectedDate:Date = new Date(Date.now())

  @ViewChild('scheduleObj') calendar!: ScheduleComponent;

  public startDate: Date | undefined;
  public endDate: Date | undefined;

  public setViews: View[] = ['Day', 'Month', 'WorkWeek']

  public psychologistControl = new FormControl('')
  public startTimeControl = new FormControl('')
  public endTimeControl = new FormControl('')


  public eventSettings?: EventSettingsModel

  availableHours: Date[] = []

  psychologistList!: User[]
  availableStartAppointments!:Date[]
  availableEndAppointments!:Date[]

  selectedStartTime!:Date
  selectedEndTime!:Date
  selectedPsychologist!:string

  constructor(public appointmentService: AppointmentService, public userService: UserService) {}



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

  public onPopupOpen(args: { type: string; data: { Patient: any, StartTime: Date }; }) {
    //Adjust so the value is the correspondent
    //let fecha = String(args.data.StartTime)
    this.startTimeControl.setValue(args.data.StartTime.toLocaleTimeString())
    this.psychologistControl.setValue(String(this.psychologistList[0]._id))
    this.handleStartTimeClick(args.data.StartTime)
  }

  public onPopupClose(args:any) {
    if (args.type === 'Editor' && args.data) {
      args.data.Subject = this.displayDate(this.psychologistControl.value)
      let startTime = new Date('2022-10-19')
      let endTime = new Date('2022-10-19')

      let time: string[]|undefined = []
      time = this.startTimeControl.value?.split(':')

      if(this.startTimeControl.value?.includes("PM")){
        startTime.setHours(Number(time?.[0])+12,Number(time?.[1])+12)
      }else{
        startTime.setHours(Number(time?.[0]),Number(time?.[1]))
      }

      time = this.endTimeControl.value?.split(':')
      if(this.endTimeControl.value?.includes("PM")){
        endTime.setHours(Number(time?.[0])+12,Number(time?.[1])+12)
      }else{
        endTime.setHours(Number(time?.[0]),Number(time?.[1]))
      }

      args.data.StartTime = startTime
      args.data.EndTime = endTime
    }
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

  displayDate(value?: number | string | null):string {

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

  toDate(time:string | number | Date):Date{
    return new Date(time)
  }

}
