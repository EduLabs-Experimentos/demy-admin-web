import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Student implements BaseEntity {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _dni: string;
  private _emailAddress: string;
  private _sex: string;
  private _birthDate: Date;
  private _phone: string;
  private _studentCode?: string;

  constructor(student: {
    id?: number;
    firstName: string;
    lastName: string;
    dni: string;
    emailAddress: string;
    sex: string;
    birthDate: string | Date;
    phone: string;
    studentCode?: string;
  }) {
    this._id = student.id || 0;
    this._firstName = student.firstName;
    this._lastName = student.lastName;
    this._dni = student.dni;
    this._emailAddress = student.emailAddress;
    this._sex = student.sex;
    this._birthDate = new Date(student.birthDate);
    this._phone = student.phone;
    this._studentCode = student.studentCode;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get firstName(): string { return this._firstName; }
  set firstName(value: string) { this._firstName = value; }

  get lastName(): string { return this._lastName; }
  set lastName(value: string) { this._lastName = value; }

  get dni(): string { return this._dni; }
  set dni(value: string) { this._dni = value; }

  get emailAddress(): string { return this._emailAddress; }
  set emailAddress(value: string) { this._emailAddress = value; }

  get sex(): string { return this._sex; }
  set sex(value: string) { this._sex = value; }

  get birthDate(): Date { return this._birthDate; }
  set birthDate(value: Date) { this._birthDate = value; }

  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }

  get studentCode(): string | undefined { return this._studentCode; }
  set studentCode(value: string | undefined) { this._studentCode = value; }
}
