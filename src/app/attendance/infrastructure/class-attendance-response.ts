import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AttendanceRecordResource {
  dni: string;
  status: string;
}

export interface ClassAttendanceResource extends BaseResource {
  id: number;
  classSessionId: number;
  date: string;
  attendance: AttendanceRecordResource[];
}

export interface ClassAttendancesResponse extends BaseResponse {
  attendances: ClassAttendanceResource[];
}
