import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ClassAttendanceApiEndpoint } from './class-attendance-api-endpoint';
import { ClassAttendance, AttendanceStatus } from '../domain/model/class-attendance.entity';

@Injectable({ providedIn: 'root' })
export class ClassAttendanceApi extends BaseApi {
  private readonly endpoint: ClassAttendanceApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.endpoint = new ClassAttendanceApiEndpoint(http);
  }

  getAll(): Observable<ClassAttendance[]> {
    return this.endpoint.getAllByAcademy();
  }

  patchStatus(id: number, dni: string, status: AttendanceStatus): Observable<ClassAttendance> {
    return this.endpoint.patchStatus(id, dni, status);
  }
}
