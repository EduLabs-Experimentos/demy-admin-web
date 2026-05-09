import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class User implements BaseEntity {
  private _id: number;
  private _emailAddress: string;

  constructor(user: {id: number, emailAddress: string}) {
    this._id = user.id;
    this._emailAddress = user.emailAddress;
  }

  set emailAddress(value: string) { this._emailAddress = value; }
  set id(value: number) { this._id = value; }
  get emailAddress(): string { return this._emailAddress; }
  get id(): number { return this._id; }
}
