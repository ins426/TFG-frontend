import { autoserializeAs } from 'dcerialize';

export class Appointment{
  /**
   * ID
   */
  @autoserializeAs(() => String) _id: number | undefined;


  constructor(
      _id:number|undefined,
  ) {
      this._id = _id
  }
}