import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class Academy implements BaseEntity {
  private _id: number;
  private _name: string;
  private _description: string;

  constructor(academy: {id: number, name: string, description: string}) {
    this._id = academy.id;
    this._name = academy.name;
    this._description = academy.description;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }
  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }
}
