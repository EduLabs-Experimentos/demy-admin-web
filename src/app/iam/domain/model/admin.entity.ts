import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class Admin implements BaseEntity {
  private _id: number;
  private _firstName: string;
  private _lastName: string;

  constructor(admin: {id: number, firstName: string, lastName: string}) {
    this._id = admin.id;
    this._firstName = admin.firstName;
    this._lastName = admin.lastName;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get firstName(): string { return this._firstName; }
  set firstName(value: string) { this._firstName = value; }
  get lastName(): string { return this._lastName; }
  set lastName(value: string) { this._lastName = value; }
}
