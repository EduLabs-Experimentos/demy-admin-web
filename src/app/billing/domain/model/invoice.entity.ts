import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Invoice implements BaseEntity {
  private _id: number;
  private _invoiceType: string;
  private _amount: string;
  private _currency: string;
  private _description: string;
  private _issueDate: Date;
  private _dueDate: Date;
  private _status: string;

  constructor(data: {
    id?: number;
    invoiceType: string;
    amount: string;
    currency: string;
    description: string;
    issueDate: string | Date;
    dueDate: string | Date;
    status: string;
  }) {
    this._id = data.id || 0;
    this._invoiceType = data.invoiceType;
    this._amount = data.amount;
    this._currency = data.currency;
    this._description = data.description;
    this._issueDate = new Date(data.issueDate);
    this._dueDate = new Date(data.dueDate);
    this._status = data.status;
  }

  // Getters
  get id(): number { return this._id; }
  get invoiceType(): string { return this._invoiceType; }
  get amount(): string { return this._amount; }
  get currency(): string { return this._currency; }
  get description(): string { return this._description; }
  get issueDate(): Date { return this._issueDate; }
  get dueDate(): Date { return this._dueDate; }
  get status(): string { return this._status; }
}
