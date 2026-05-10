import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Invoice } from './invoice.entity';

export class BillingAccount implements BaseEntity {
  private _id: number;
  private _studentId: number;
  private _dniNumber: string;
  private _academyId: number;
  private _invoices: Invoice[];

  constructor(data: {
    id?: number;
    studentId: number;
    dniNumber: string;
    academyId?: number;
    invoices?: Invoice[];
  }) {
    this._id = data.id || 0;
    this._studentId = data.studentId;
    this._dniNumber = data.dniNumber;
    this._academyId = data.academyId || 0;
    this._invoices = data.invoices || [];
  }

  // Getters
  get id(): number { return this._id; }
  get studentId(): number { return this._studentId; }
  get dniNumber(): string { return this._dniNumber; }
  get academyId(): number { return this._academyId; }
  get invoices(): Invoice[] { return this._invoices; }
}
