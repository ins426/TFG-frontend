export interface AppointmentInterface {
    Subject: string;
    StartTime?: Date;
    EndTime?: Date;
    id_psychologist: string|null;
    Observations: string;
    id_patient:string
    color:string
}