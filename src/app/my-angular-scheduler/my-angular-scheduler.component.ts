import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  CellClickEventArgs, DragEventArgs, EventRenderedArgs,
  ScheduleComponent, View
} from '@syncfusion/ej2-angular-schedule';
import {L10n} from '@syncfusion/ej2-base';
import { loadCldr} from '@syncfusion/ej2-base';
import {MonthService, DayService, WeekService, EventSettingsModel, WorkWeekService,
DragAndDropService} from '@syncfusion/ej2-angular-schedule';
import {FormControl} from "@angular/forms";
import {AppointmentService} from "../../services/appointment.service";
import {UserService} from "../../services/user.service";
import {BehaviorSubject, finalize, Observable, startWith, switchMap, tap} from "rxjs";
import {User} from "../../models/user";
import {AppointmentInterface} from "../../interfaces/appointment";
import {MatCalendar} from "@angular/material/datepicker";

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
export class MyAngularSchedulerComponent implements OnInit, OnChanges{
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
  openModifyDialogSelectedStartTime?:Date
  openModifyDialogSelectedEndTime?:Date
  openCreateDialogSelectedStartTime?:Date
  openDialogPsychlogist?:string | undefined | null
  openDialogSelectedId!:number | undefined
  openDialogOldAppointments:Date[] = []

  selectedEndTime!:Date
  selectedPsychologist!:string
  selectedDay!: Date;

  constructor(public appointmentService: AppointmentService, public userService: UserService) {}


  public onEventRendered(args: EventRenderedArgs): void {
    const categoryColor: string = args.data['CategoryColor'] as string;
    args.element.style.backgroundColor = categoryColor;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("holaaaaa")
  }

  ngOnInit(): void {
    //TODO Aqui segun el rol del usuario se obtendran todos los psicologos, el psicologo que es o el psicologo del paciente
    //Get psychologist list
    this.selectedDay = new Date()

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
    ).subscribe( (availableHours) =>
      {
        if (this.psychologistControl.value) {
          if(!this.openModifyDialogSelectedStartTime ||
              (this.openDialogPsychlogist != this.psychologistControl.value)){
            this.availableStartAppointments = []
          }
          if(this.openDialogPsychlogist == this.psychologistControl.value){
            this.availableStartAppointments = this.openDialogOldAppointments
          }
          if(!this.openDialogSelectedId)
            this.availableStartAppointments = []
          for(let i = 0; i < availableHours.length; ++i){
            this.availableStartAppointments.push(availableHours[i])
          }
          this.availableStartAppointments.sort(
              (a,b)=>a.getTime() - b.getTime()
          )

          if(this.openCreateDialogSelectedStartTime && !this.openDialogSelectedId){
            for(let i = 0; i < this.availableStartAppointments.length; ++i){

              if(this.availableStartAppointments[i].getTime() == this.openCreateDialogSelectedStartTime.getTime()){
                this.startTimeControl.setValue(this.openCreateDialogSelectedStartTime.toLocaleTimeString())
                break
              }else{
                this.startTimeControl.setValue("")
              }
            }
          }
        }
         if(this.availableStartAppointments[0] && (!this.openDialogPsychlogist ||
             this.openDialogPsychlogist != this.psychologistControl.value)){
          this.handleAvailableEndHours(this.selectedStartTime)
        }else if(!this.availableStartAppointments){
           this.handleAvailableEndHours(this.availableStartAppointments[0])
         }
      }
    )

    this.startTimeControl.valueChanges.pipe(
        startWith(this.startTimeControl.value)
    ).subscribe(async (newStartTime) => {
          if (this.availableEndAppointments.length != 0 && newStartTime) {
            this.availableEndAppointments = []
            if(this.openModifyDialogSelectedStartTime?.getTime() === this.toDate(newStartTime).getTime()){
              await this.handleAvailableEndHours(this.toDate(newStartTime), this.openModifyDialogSelectedEndTime)
            }else if(this.openModifyDialogSelectedStartTime && this.openModifyDialogSelectedEndTime ){
              if((this.openModifyDialogSelectedStartTime?.getTime() < this.toDate(newStartTime).getTime() ||
                this.toDate(newStartTime).getTime() < this.openModifyDialogSelectedEndTime!.getTime())){
                await this.handleAvailableEndHours(this.toDate(newStartTime), this.openModifyDialogSelectedEndTime)
              }
            }
            else{
              await this.handleAvailableEndHours(this.toDate(newStartTime))
            }
            this.endTimeControl.setValue("")
          }else{
            if(newStartTime && this.availableEndAppointments.length == 0){
              await this.handleAvailableEndHours(this.toDate(newStartTime))
            }
          }
        }
    )

  }

  public async onPopupOpen(args: { type: string; data: { Patient: any, StartTime: Date, Id: number, EndTime: Date,
      _id: number, Subject:string, id_psychologist:number },element:any; }) {
    //Adjust so the value is the correspondent
    //let fecha = String(args.data.StartTime)
    this.availableEndAppointments = []
    this.availableStartAppointments = []
    this.openModifyDialogSelectedStartTime = undefined
    this.openModifyDialogSelectedEndTime = undefined
    this.openDialogPsychlogist = undefined
    this.openDialogSelectedId = undefined
    this.openCreateDialogSelectedStartTime = undefined

    this.selectedDay = (new Date(args.data.StartTime))

    if (args.data.Id) {
      this.openModifyDialogSelectedStartTime = new Date(args.data.StartTime)
      this.openModifyDialogSelectedEndTime = new Date(args.data.EndTime)
      this.availableStartAppointments.push(args.data.StartTime)
      this.openDialogSelectedId = args.data.Id

      let time = new Date(args.data.StartTime)
      time.setMinutes(time.getMinutes() + 5)
      let middleTime = new Date(args.data.EndTime)
      middleTime.setMinutes(middleTime.getMinutes() - 5)

      for (let i = time; i.getTime() <= middleTime.getTime(); i.setMinutes(i.getMinutes() + 5)) {
        let hour = new Date(i)
        this.availableStartAppointments.push(hour)
      }

      this.openDialogOldAppointments = this.availableStartAppointments

      this.psychologistList.forEach((psychologist)=>{
        if(psychologist._id === args.data.id_psychologist){
          this.psychologistControl.setValue(String(psychologist._id))
        }
      })
    }else{
      this.openCreateDialogSelectedStartTime = new Date(args.data.StartTime)
      this.psychologistControl.setValue(String(this.psychologistList[0]._id))
    }

    if (!args.data.Id) {
      this.handleAvailableEndHours(args.data.StartTime)
    } else {
      this.handleAvailableEndHours(args.data.StartTime, args.data.EndTime)
      this.startTimeControl.setValue(args.data.StartTime.toLocaleTimeString())
    }

  }

  public onPopupClose(args: { type: string; data: { Patient: any, StartTime: Date, Id: number, EndTime: Date,
      _id: number, Subject:string, id_psychologist:number, CategoryColor:any }; element:any }) {

    if (args.type === 'Editor' && args.data) {
      if(this.openDialogSelectedId){
        let appointmentRecords = Object(this.eventSettings!.dataSource)
        let endTime = this.getTime('end')
        let startTime = this.getTime('start')
        appointmentRecords[this.openDialogSelectedId-1].StartTime = startTime
        appointmentRecords[this.openDialogSelectedId-1].EndTime = endTime

        let psychologist = this.psychologistList.find(({_id})=>String(_id) == this.psychologistControl!.value)
        args.data.CategoryColor = psychologist?.CategoryColor
        args.data.Subject = psychologist!.name + " "+ psychologist!.surname

        const updatedAppointment: AppointmentInterface = {
          Subject:args.data.Subject,
          StartTime: startTime,
          EndTime: endTime,
          id_psychologist: this.psychologistControl!.value,
          Observations:"esto es una prueba",
          id_patient: "63396cf1912916e9cd0d3909",
          CategoryColor: psychologist!.CategoryColor
        }


        this.appointmentService.modifyAppointment(updatedAppointment,appointmentRecords[this.openDialogSelectedId-1]._id)

        if(this.eventSettings?.dataSource instanceof Array){
          for(let i = 0, a = this.eventSettings.dataSource; i < a.length;++i){
            let event = a[i]
            //TODO Complete with the rest of fields
            if(appointmentRecords[this.openDialogSelectedId-1]._id == event['_id']){
              event['Subject'] = args.data.Subject
              event['CategoryColor'] = psychologist!.CategoryColor
              event['id_psychologist'] = this.psychologistControl!.value
            }
          }
        }
      }else{
        args.data.Subject = this.displayDate(this.psychologistControl.value)

        //Format hours so Syncfusion Angular Scheduler can display them
        let startTime = this.getTime('start')
        let endTime = this.getTime('end')

        args.data.StartTime = startTime
        args.data.EndTime = endTime

        let psychologist = this.psychologistList.find(({_id})=>String(_id) == this.psychologistControl!.value)
        args.data.CategoryColor = psychologist?.CategoryColor

        const newAppointment: AppointmentInterface = {
          Subject:args.data.Subject,
          StartTime: args.data.StartTime,
          EndTime: args.data.EndTime,
          id_psychologist: this.psychologistControl!.value,
          Observations:"esto es una prueba",
          id_patient: "63396cf1912916e9cd0d3909",
          CategoryColor: psychologist!.CategoryColor
        }


        this.appointmentService.postAppointment(newAppointment)
        this.appointmentService.getAppointments().subscribe((response: any) => {
            let records: Record<string, any>[] = []
            response.forEach((appointment: any) => records.push(appointment));
            this.eventSettings = {dataSource: records}
          })
        }
    }

  }

  onCellClick(args: CellClickEventArgs): void {
    this.calendar.openEditor(args, 'Add');
  }

  onDragStart(args: DragEventArgs): void {
      args.interval = 10; // drag interval time is changed to 10 minutes
  }

  getAvailableStartHours(psychologist:string |null): Observable<Array<Date>>{
    let date = ""
    let month = Number(this.selectedDay?.getMonth())+1
    let day = this.selectedDay?.getDate()
    let year = this.selectedDay?.getFullYear()
    date = year+"-"+month+"-"+day

    return this.appointmentService.getAvailableStartAppointments(psychologist,date)
  }

  getAvailableEndHours(psychologist:string |null,chosenStart:Date, endTime?:Date): Observable<Array<Date>>{
    let date = ""

    let month = Number(this.selectedDay?.getMonth())+1
    let day = this.selectedDay?.getDate()
    let year = this.selectedDay?.getFullYear()
    date = year+"-"+month+"-"+day

    return this.appointmentService.getAvailableEndAppointments(psychologist,chosenStart, date,endTime)
  }

  handleAvailableEndHours(startTime:Date, endTime?:Date){
    this.selectedStartTime = startTime

    this.getAvailableEndHours(this.psychologistControl.value,this.selectedStartTime, endTime).pipe(
        finalize(()=>{
          //When modifying dialog
          if(this.openModifyDialogSelectedEndTime && this.selectedStartTime.getTime() === this.openModifyDialogSelectedStartTime?.getTime()){
            this.endTimeControl.setValue(this.openModifyDialogSelectedEndTime.toLocaleTimeString())
          }else{
            for(let i = 0; i < this.availableStartAppointments.length; i++){
              if(this.availableStartAppointments[i].getHours() == startTime.getHours() &&
              this.availableStartAppointments[i].getMinutes() == startTime.getMinutes()){
                this.endTimeControl.setValue(this.availableEndAppointments[0].toLocaleTimeString())
                break
              }else{
                this.endTimeControl.setValue("")
              }
            }
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
    let date = new Date(this.selectedDay!)

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

  getTime(whenTime:string):Date{
    let time = new Date(this.selectedDay!)

    let hour: string[]|undefined = []

    if(whenTime == 'start'){
      hour = this.startTimeControl.value?.split(':')
      if(this.startTimeControl.value?.includes("PM") &&
        hour?.[0] != '12'){
          time.setHours(Number(hour?.[0])+12,Number(hour?.[1]))
        }else{
          time.setHours(Number(hour?.[0]),Number(hour?.[1]))
        }
    }else{
      hour = this.endTimeControl.value?.split(':')
      if(this.endTimeControl.value?.includes("PM") &&
        hour?.[0] != '12'){
          time.setHours(Number(hour?.[0])+12,Number(hour?.[1]))

      }else{
          time.setHours(Number(hour?.[0]),Number(hour?.[1]))
        }
    }

    return time
  }

  changeDate(newDate:Date):void{
    this.selectedDay = newDate
    this.getAvailableStartHours(this.psychologistControl.value).subscribe((availableHours)=>{
      this.availableStartAppointments = []
      for(let i = 0; i < availableHours.length; ++i){
            this.availableStartAppointments.push(availableHours[i])
      }

      let includeHour = false
      for(let i = 0; i < this.availableStartAppointments.length; ++i){
        if(this.availableStartAppointments[i].getHours() == this.toDate(this.startTimeControl.value!).getHours() &&
        this.availableStartAppointments[i].getMinutes() == this.toDate(this.startTimeControl.value!).getMinutes()){
          includeHour = true
          break
        }
      }

      if(!includeHour){
        this.startTimeControl.setValue(this.availableStartAppointments[0].toLocaleTimeString())
      }

    })
  }

}
