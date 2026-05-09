import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ScheduleEndpoint} from './schedule-endpoint';
import {CreateWeeklyScheduleRequest, UpdateWeeklyScheduleNameRequest, AddScheduleToWeeklyRequest, UpdateScheduleRequest} from './schedule-request';
import {WeeklyScheduleResource, ScheduleResource} from './schedule-response';

@Injectable({providedIn: 'root'})
export class ScheduleApi {
  private readonly endpoint: ScheduleEndpoint;

  constructor(http: HttpClient) {
    this.endpoint = new ScheduleEndpoint(http);
  }

  getAll(): Observable<WeeklyScheduleResource[]> {
    return this.endpoint.getAll();
  }

  getById(scheduleId: number): Observable<WeeklyScheduleResource> {
    return this.endpoint.getById(scheduleId);
  }

  create(request: CreateWeeklyScheduleRequest): Observable<WeeklyScheduleResource> {
    return this.endpoint.create(request);
  }

  update(scheduleId: number, request: UpdateWeeklyScheduleNameRequest): Observable<WeeklyScheduleResource> {
    return this.endpoint.update(scheduleId, request);
  }

  delete(scheduleId: number): Observable<void> {
    return this.endpoint.delete(scheduleId);
  }

  addClassSession(scheduleId: number, request: AddScheduleToWeeklyRequest): Observable<WeeklyScheduleResource> {
    return this.endpoint.addClassSession(scheduleId, request);
  }

  removeClassSession(scheduleId: number, classSessionId: number): Observable<WeeklyScheduleResource> {
    return this.endpoint.removeClassSession(scheduleId, classSessionId);
  }

  updateClassSession(classSessionId: number, request: UpdateScheduleRequest): Observable<ScheduleResource> {
    return this.endpoint.updateClassSession(classSessionId, request);
  }
}
