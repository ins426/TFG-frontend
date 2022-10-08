import {Component, OnInit, ViewChild} from '@angular/core';
import {EventSettingsModel, ScheduleComponent, View} from "@syncfusion/ej2-angular-schedule";
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AppointmentService} from "../../services/appointment.service";
import {isNullOrUndefined} from "@syncfusion/ej2-base";
import {ChangeEventArgs} from "@syncfusion/ej2-calendars";

@Component({
  selector: 'app-my-angular-schedule',
  templateUrl: './my-angular-schedule.component.html',
  styleUrls: ['./my-angular-schedule.component.scss']
})
export class MyAngularScheduleComponent implements OnInit {

  @ViewChild('calendar') calendar?: ScheduleComponent;
  public startDate: Date | undefined;
  public endDate: Date | undefined;

  public selectedDate: Date = new Date(2021, 1, 15);

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
}
