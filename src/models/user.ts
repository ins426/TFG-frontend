import { autoserializeAs } from 'dcerialize';

export class User{
  /**
   * ID
   */
  @autoserializeAs(() => String) _id: number | undefined;

  /**
   * User name
   */
  @autoserializeAs(() => String) name: string;

  /**
   * User surname
   */
  @autoserializeAs(() => String) surname: string;

  /**
   * User email
   */
  @autoserializeAs(() => String) email: string;

  /**
   * If user is a psychologist, they will have an array of patients
   */
  @autoserializeAs(() => String) id_patients: number[];

  /**
   * User rol
   */
  @autoserializeAs(() => String) rol: string;

  /**
   * User password
   */
  @autoserializeAs(() => String) password: string;

  /**
   * Psychologist color
   */
  @autoserializeAs(() => String) CategoryColor: string;

  constructor(
      _id:number|undefined,
      name:string,
      surname:string,
      email:string,
      id_patients:number[],
      rol:string,
      password: string,
      CategoryColor:string
  ) {
      this._id = _id
      this.name = name
      this.surname = surname
      this.email = email
      this.id_patients = id_patients
      this.rol = rol
      this.password = password
      this.CategoryColor = CategoryColor
  }
}
