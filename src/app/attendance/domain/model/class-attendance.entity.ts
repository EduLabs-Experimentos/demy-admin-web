import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'EXCUSED';

export interface AttendanceRecord {
  dni: string;
  status: AttendanceStatus;
}

export class ClassAttendance implements BaseEntity {
  private _id: number;
  private _classSessionId: number;
  private _date: string;
  private _attendance: AttendanceRecord[];

  constructor(data: {
    id?: number;
    classSessionId: number;
    date: string;
    attendance: AttendanceRecord[];
  }) {
    this._id = data.id ?? 0;
    this._classSessionId = data.classSessionId;
    this._date = data.date;
    this._attendance = data.attendance;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get classSessionId(): number { return this._classSessionId; }
  get date(): string { return this._date; }
  get attendance(): AttendanceRecord[] { return this._attendance; }
  get label(): string { return `Session ${this._classSessionId}`; }
}
