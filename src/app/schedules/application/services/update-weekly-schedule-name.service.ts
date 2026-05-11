import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ScheduleApi} from '../../infrastructure/schedule-api';
import {UpdateWeeklyScheduleNameRequest} from '../../infrastructure/schedule-request';
import {WeeklyScheduleResource} from '../../infrastructure/schedule-response';

@Injectable({providedIn: 'root'})
export class UpdateWeeklyScheduleNameService {
  constructor(private readonly scheduleApi: ScheduleApi) {}

  execute(scheduleId: number, request: UpdateWeeklyScheduleNameRequest): Observable<WeeklyScheduleResource> {
    return this.scheduleApi.update(scheduleId, request);
  }
}
