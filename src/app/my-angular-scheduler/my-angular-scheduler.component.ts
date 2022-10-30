import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionEventArgs,
  CellClickEventArgs, EventRenderedArgs,
  ScheduleComponent, TimeScaleModel, View
} from '@syncfusion/ej2-angular-schedule';
import {L10n} from '@syncfusion/ej2-base';
import { loadCldr} from '@syncfusion/ej2-base';
import {MonthService, DayService, WeekService, EventSettingsModel, WorkWeekService} from '@syncfusion/ej2-angular-schedule';
import {FormControl} from "@angular/forms";
import {AppointmentService} from "../../services/appointment.service";
import {UserService} from "../../services/user.service";
import {finalize, Observable, startWith, switchMap, tap} from "rxjs";
import {User} from "../../models/user";
import {AppointmentInterface} from "../../interfaces/appointment";
import {SnackbarService} from "../../services/snackbar.service";

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
      cancelButton: 'Cancelar',
      deleteContent: "Si eliminas esta cita se borrará permanentemente del calendario",
      deleteEvent: "¿Eliminar cita?",
      cancel: "Cancelar",
      delete: "Eliminar",
      deleteButton: "Eliminar"
    }
  }
});

@Component({
  selector: 'app-my-angular-scheduler',
  providers: [DayService, WeekService,MonthService, WorkWeekService],
  templateUrl: './my-angular-scheduler.component.html',
  styleUrls: ['./my-angular-scheduler.component.scss']
})
export class MyAngularSchedulerComponent implements OnInit{
  public workWeekDays: number[] = [1,2,3,4,5];
  today = new Date()
  public minDate: undefined | Date;
  public mySelectedDate:Date = new Date(Date.now())

  @ViewChild('scheduleObj') calendar!: ScheduleComponent;

  public startDate: Date | undefined;
  public endDate: Date | undefined;

  public setViews: View[] = ['Day', 'WorkWeek']

  public psychologistControl = new FormControl('')
  public patientControl = new FormControl('')
  public startTimeControl = new FormControl('')
  public endTimeControl = new FormControl('')
  public observationsControl = new FormControl('')


  public eventSettings?: EventSettingsModel

  availableHours: Date[] = []

  psychologistList!: User[]
  patientsList!: User[]
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

  shownSnackBar = false

  public timeScale: TimeScaleModel = { enable: true, interval: 15, slotCount: 1 };

  constructor(public appointmentService: AppointmentService, public userService: UserService,
              public snackbarService:SnackbarService) {}


  public onEventRendered(args: EventRenderedArgs): void {
    const categoryColor: string = args.data['CategoryColor'] as string;
    args.element.style.backgroundColor = categoryColor;
  }

  ngOnInit(): void {
    //TODO Aqui segun el rol del usuario se obtendran todos los psicologos, el psicologo que es o el psicologo del paciente
    //Get psychologist list
    this.selectedDay = new Date()

    let userData = JSON.parse(localStorage.getItem("userData")!)

    if(userData['rol'] == 'paciente'){
      this.minDate = new Date()
      this.minDate.setMonth(this.minDate.getMonth())
      this.minDate.setDate(this.minDate.getDate()-1)
      this.patientControl.disable()
      this.psychologistControl.disable()
    }

    if(userData['rol'] == 'psicologo'){
      this.psychologistControl.disable()
    }

    this.userService.getPsychologists().subscribe((psychologists) => {
      this.psychologistList = psychologists
    })

    this.userService.getPatients().subscribe((patients)=>{
      this.patientsList = patients
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

          if(this.availableStartAppointments == []){
            for(let i = 0; i < availableHours.length; ++i){
              this.availableStartAppointments.push(availableHours[i])
            }
          }else{
            for(let i = 0; i < availableHours.length; ++i){
              let contains = false
              for(let j = 0; j < this.availableStartAppointments.length; ++j){
                if(this.availableStartAppointments[j].getTime() == availableHours[i].getTime()){
                  contains = true
                  break
                }
              }
              if(!contains){
                this.availableStartAppointments.push(availableHours[i])
              }
            }
          }

          this.availableStartAppointments.sort(
              (a,b)=>a.getTime() - b.getTime()
          )

          let hourBefore = new Date(this.openModifyDialogSelectedStartTime!)
          hourBefore.setHours(hourBefore.getHours()-1)

          if(hourBefore.getHours() < 10){
            let startDay = new Date(this.openModifyDialogSelectedStartTime!)
            startDay.setHours(10,0,0,0)

            for(let i = new Date(startDay); i.getTime() < this.openModifyDialogSelectedStartTime!.getTime()
                ;i.setMinutes(i.getMinutes() + 5)){
              let hour = new Date(i)
              this.availableStartAppointments.push(hour)
            }
          }else if(this.isIntervalAvailable(hourBefore)){
            let start = new Date(hourBefore)
            start.setMinutes(hourBefore.getMinutes()+5)
            for(let i = start ; i.getTime() < this.openModifyDialogSelectedStartTime!.getTime()
                ;i.setMinutes(i.getMinutes() + 5)){
              let hour = new Date(i)
              this.availableStartAppointments.push(hour)
            }
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

        let contains= false
        for(let i = 0; i < this.availableStartAppointments.length; ++i){
          if(this.availableStartAppointments[i].toLocaleTimeString() == this.startTimeControl.value){
            contains = true
            break
          }
        }

        if(!contains && this.availableStartAppointments[0]){
          this.startTimeControl.setValue(this.availableStartAppointments[0].toLocaleTimeString())
          this.selectedStartTime = this.availableStartAppointments[0]

          if(!this.shownSnackBar){
            this.snackbarService.openSnackBar()
            this.shownSnackBar = true
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
      _id: number, Subject:string, id_psychologist:number, id_patient:number, Observations:string },element:any; }) {
    //Adjust so the value is the correspondent
    //let fecha = String(args.data.StartTime)
    this.availableEndAppointments = []
    this.availableStartAppointments = []
    this.openModifyDialogSelectedStartTime = undefined
    this.openModifyDialogSelectedEndTime = undefined
    this.openDialogPsychlogist = undefined
    this.openDialogSelectedId = undefined
    this.openCreateDialogSelectedStartTime = undefined
    this.shownSnackBar = false

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
      this.patientsList.forEach((patient)=>{
        if(patient._id === args.data.id_patient){
          this.patientControl.setValue(String(patient._id))
        }
      })
      this.observationsControl.setValue(args.data.Observations)

    }else{
      this.openCreateDialogSelectedStartTime = new Date(args.data.StartTime)
      this.psychologistControl.setValue(String(this.psychologistList[0]._id))
      this.patientControl.setValue(String(this.patientsList[0]._id))
    }

    if (!args.data.Id) {
      this.handleAvailableEndHours(args.data.StartTime)
    } else {
      this.handleAvailableEndHours(args.data.StartTime, args.data.EndTime)
      this.startTimeControl.setValue(args.data.StartTime.toLocaleTimeString())
    }

  }

  public onPopupClose(args: { type: string; data: { Patient: any, StartTime: Date, Id: number, EndTime: Date,
      _id: number, Subject:string, id_psychologist:number,id_patient:number, CategoryColor:any, observations:string }; element:any }) {

    if (args.type === 'Editor' && args.data) {
      if(this.openDialogSelectedId){
        let appointmentRecords = Object(this.eventSettings!.dataSource)
        let endTime = this.getTime('end')
        let startTime = this.getTime('start')
        appointmentRecords[this.openDialogSelectedId-1].StartTime = startTime
        appointmentRecords[this.openDialogSelectedId-1].EndTime = endTime

        let psychologist = this.psychologistList.find(({_id})=>String(_id) == this.psychologistControl!.value)
        let patient = this.patientsList.find(({_id})=>String(_id) == this.patientControl!.value)

        args.data.CategoryColor = psychologist?.CategoryColor
        args.data.Subject = patient!.name + " "+ patient!.surname

        const updatedAppointment: AppointmentInterface = {
          Subject:args.data.Subject,
          StartTime: startTime,
          EndTime: endTime,
          id_psychologist: this.psychologistControl!.value,
          Observations:this.observationsControl.value!,
          id_patient: this.patientControl!.value,
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
              event['id_patient'] = this.patientControl!.value
              event['Observations'] = this.observationsControl.value!
            }
          }
        }
      }else{
        args.data.Subject = this.displayPatient(this.patientControl.value)

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
          Observations:this.observationsControl.value!,
          id_patient: this.patientControl!.value,
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

  displayPatient(value?: number | string | null):string {

    if(value){
      let name = this.patientsList.find(patient => patient._id === value)!.name
      let surname = this.patientsList.find(patient => patient._id === value)!.surname

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

  isIntervalAvailable(startHour:Date):boolean{
    let nextHour = new Date(startHour)
    nextHour.setHours(nextHour.getHours()+1)


    for(let j = 0; j < this.availableStartAppointments.length; j+=2){
        if(this.availableStartAppointments[j].getTime() == startHour.getTime()){
          if(this.availableStartAppointments[j+1] && this.availableStartAppointments[j+1].getTime() == nextHour.getTime() )
            return true
        }
    }

    return false
  }


  onActionBegin(args: ActionEventArgs) {
    if (args.requestType === 'eventRemove') {
      if (args.deletedRecords!.length > 0) {
        if(args.deletedRecords instanceof Array){
          if(this.eventSettings?.dataSource instanceof Array){
            this.eventSettings.dataSource.splice(args.deletedRecords[0]['Id']-1,1)
            this.appointmentService.deleteAppointment(args.deletedRecords[0]['_id'])
          }
        }
      }
    }
  }

  getMinorTime(date: any): string {
    return date.getHours() + ":" + date.getMinutes()
  }

}
