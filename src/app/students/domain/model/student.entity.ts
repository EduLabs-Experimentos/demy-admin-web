import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Student implements BaseEntity {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _dni: string;
  private _emailAddress: string; // <--- Fíjate que diga emailAddress
  private _sex: string;
  private _birthDate: Date;
  private _phone: string;
  private _studentCode?: string;
  private _street: string;
  private _district: string;
  private _province: string;
  private _department: string;
  private _countryCode: string;

  constructor(student: {
    id?: number;
    firstName: string;
    lastName: string;
    dni: string;
    emailAddress: string; // <--- AQUÍ DEBE DECIR emailAddress, NO email
    sex: string;
    birthDate: string | Date;
    phone: string;
    studentCode?: string;
    street?: string;
    district?: string;
    province?: string;
    department?: string;
    countryCode?: string;
  }) {
    this._id = student.id || 0;
    this._firstName = student.firstName;
    this._lastName = student.lastName;
    this._dni = student.dni;
    this._emailAddress = student.emailAddress; // <--- Mapeo correcto
    this._sex = student.sex;
    this._birthDate = new Date(student.birthDate);
    this._phone = student.phone;
    this._studentCode = student.studentCode;
    this._street = student.street || '';
    this._district = student.district || '';
    this._province = student.province || '';
    this._department = student.department || '';
    this._countryCode = student.countryCode || '+51';
  }

  // Getters y Setters...
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get firstName(): string { return this._firstName; }
  set firstName(value: string) { this._firstName = value; }
  get lastName(): string { return this._lastName; }
  set lastName(value: string) { this._lastName = value; }
  get dni(): string { return this._dni; }
  set dni(value: string) { this._dni = value; }
  get emailAddress(): string { return this._emailAddress; } // <--- Debe llamarse emailAddress
  set emailAddress(value: string) { this._emailAddress = value; }
  get sex(): string { return this._sex; }
  set sex(value: string) { this._sex = value; }
  get birthDate(): Date { return this._birthDate; }
  set birthDate(value: Date) { this._birthDate = value; }
  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }
  get studentCode(): string | undefined { return this._studentCode; }
  set studentCode(value: string | undefined) { this._studentCode = value; }
  get street(): string { return this._street; }
  set street(value: string) { this._street = value; }
  get district(): string { return this._district; }
  set district(value: string) { this._district = value; }
  get province(): string { return this._province; }
  set province(value: string) { this._province = value; }
  get department(): string { return this._department; }
  set department(value: string) { this._department = value; }
  get countryCode(): string { return this._countryCode; }
  set countryCode(value: string) { this._countryCode = value; }
}
