export interface AppointmentInterface {
    Subject: string;
    StartTime?: Date;
    EndTime?: Date;
    _id?:number;
    id_psychologist: string|null;
    Observations: string;
    id_patient:string|null
    CategoryColor:string
}