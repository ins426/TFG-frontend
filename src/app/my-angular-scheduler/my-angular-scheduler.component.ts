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
import {finalize, Observable, startWith, switchMap, tap} from "rxjs";
import {User} from "../../models/user";
import {AppointmentInterface} from "../../interfaces/appointment";

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
  availableStartAppointments:Date[] = []
  availableEndAppointments:Date[] = []

  selectedStartTime!:Date
  openDialogSelectedStartTime?:Date
  openDialogSelectedEndTime?:Date
  openDialogPsychlogist?:string | undefined | null

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
         this.getAvailableStartHours(psychologist).pipe()
        ),
        tap(()=>{
          if(!this.openDialogPsychlogist)
            this.openDialogPsychlogist = this.psychologistControl.value
        })
    ).subscribe( (availableHours) => {
      if (this.psychologistControl.value) {
        if(!this.openDialogSelectedStartTime ||
            (this.openDialogPsychlogist != this.psychologistControl.value)){
          this.availableStartAppointments = []
        }

        for(let i = 0; i < availableHours.length; ++i){
          this.availableStartAppointments.push(availableHours[i])
        }
      }
      if (this.availableStartAppointments[0])
        this.handleAvailableEndHours(this.availableStartAppointments[0])
    })

    this.startTimeControl.valueChanges.pipe(
        startWith(this.startTimeControl.value)
    ).subscribe(async (newStartTime) => {
          if (this.availableEndAppointments.length != 0 && newStartTime) {
            this.availableEndAppointments = []

            if(this.openDialogSelectedStartTime?.getTime() === this.toDate(newStartTime).getTime()){
              await this.handleAvailableEndHours(this.toDate(newStartTime), this.openDialogSelectedEndTime)
            }else if(this.openDialogSelectedStartTime && this.openDialogSelectedEndTime ){
              if((this.openDialogSelectedStartTime?.getTime() < this.toDate(newStartTime).getTime() &&
                this.toDate(newStartTime).getTime() < this.openDialogSelectedEndTime!.getTime())){
                await this.handleAvailableEndHours(this.toDate(newStartTime), this.openDialogSelectedEndTime)
              }
            }
            else{
              await this.handleAvailableEndHours(this.toDate(newStartTime))
            }
            this.endTimeControl.setValue("")
          }
        }
    )

  }

  public async onPopupOpen(args: { type: string; data: { Patient: any, StartTime: Date, Id: number, EndTime: Date,
      _id: number, Subject:string, id_psychologist:number }; }) {
    //Adjust so the value is the correspondent
    //let fecha = String(args.data.StartTime)
    this.availableEndAppointments = []
    this.availableStartAppointments = []
    this.openDialogSelectedStartTime = undefined
    this.openDialogSelectedEndTime = undefined
    this.openDialogPsychlogist = undefined

    if (args.data.Id) {
      this.openDialogSelectedStartTime = new Date(args.data.StartTime)
      this.openDialogSelectedEndTime = new Date(args.data.EndTime)
      this.availableStartAppointments.push(args.data.StartTime)

      let time = new Date(args.data.StartTime)
      time.setMinutes(time.getMinutes() + 5)
      let middleTime = new Date(args.data.EndTime)
      middleTime.setMinutes(middleTime.getMinutes() - 5)

      for (let i = time; i.getTime() <= middleTime.getTime(); i.setMinutes(i.getMinutes() + 5)) {
        let hour = new Date(i)
        this.availableStartAppointments.push(hour)
      }

      this.psychologistList.forEach((psychologist)=>{
        if(psychologist._id === args.data.id_psychologist){
          this.psychologistControl.setValue(String(psychologist._id))
        }
      })
    }else{
      this.psychologistControl.setValue(String(this.psychologistList[0]._id))
    }

    if (!args.data.Id) {
      this.handleAvailableEndHours(args.data.StartTime)
    } else {
      this.handleAvailableEndHours(args.data.StartTime, args.data.EndTime)
    }

    this.startTimeControl.setValue(args.data.StartTime.toLocaleTimeString())

  }

  public onPopupClose(args:any) {
    if (args.type === 'Editor' && args.data) {
      args.data.Subject = this.displayDate(this.psychologistControl.value)

      //Format hours so Syncfusion Angular Scheduler can display them
      let startTime = new Date('2022-10-19')
      let endTime = new Date('2022-10-19')

      let time: string[]|undefined = []
      time = this.startTimeControl.value?.split(':')

      if(this.startTimeControl.value?.includes("PM") &&
      time?.[0] != '12'){
        startTime.setHours(Number(time?.[0])+12,Number(time?.[1]))
      }else{
        startTime.setHours(Number(time?.[0]),Number(time?.[1]))
      }

      time = this.endTimeControl.value?.split(':')
      if(this.endTimeControl.value?.includes("PM") &&
      time?.[0] != '12'){
        endTime.setHours(Number(time?.[0])+12,Number(time?.[1]))
      }else{
        endTime.setHours(Number(time?.[0]),Number(time?.[1]))
      }

      args.data.StartTime = startTime
      args.data.EndTime = endTime

      const newAppointment: AppointmentInterface = {
        Subject:args.data.Subject,
        StartTime: args.data.StartTime,
        EndTime: args.data.EndTime,
        id_psychologist: this.psychologistControl!.value,
        Observations:"esto es una prueba",
        id_patient: "63396cf1912916e9cd0d3909",
        color: "red"
      }

      this.appointmentService.postAppointment(newAppointment)

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

  getAvailableEndHours(psychologist:string |null,chosenStart:Date, endTime?:Date): Observable<Array<Date>>{
    return this.appointmentService.getAvailableEndAppointments(psychologist,chosenStart, endTime)
  }

  handleAvailableEndHours(startTime:Date, endTime?:Date){
    this.selectedStartTime = startTime

    this.getAvailableEndHours(this.psychologistControl.value,this.selectedStartTime, endTime).pipe(
        finalize(()=>{
          //When modifying dialog
          if(this.openDialogSelectedEndTime && startTime.getTime() === this.openDialogSelectedStartTime?.getTime()){
            this.endTimeControl.setValue(this.openDialogSelectedEndTime.toLocaleTimeString())
          }else{
            this.endTimeControl.setValue(this.availableEndAppointments[0].toLocaleTimeString())
          }
        })
    ).subscribe((availableEndHours)=>{
       availableEndHours.forEach((availableHour)=>{
         this.availableEndAppointments.push(availableHour)
       })
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

  toDate(timeString:string):Date{
    let date = new Date('2022-10-19')

    let time: string[]|undefined = []
    time = timeString.split(':')

    if(timeString.includes("PM") &&
      time?.[0] != '12'){
        date.setHours(Number(time?.[0])+12,Number(time?.[1]))
      }else{
        date.setHours(Number(time?.[0]),Number(time?.[1]))
      }

    return date
  }

}
