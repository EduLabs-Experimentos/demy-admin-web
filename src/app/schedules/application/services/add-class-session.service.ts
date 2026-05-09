import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ScheduleApi} from '../../infrastructure/schedule-api';
import {AddScheduleToWeeklyRequest} from '../../infrastructure/schedule-request';
import {WeeklyScheduleResource} from '../../infrastructure/schedule-response';

@Injectable({providedIn: 'root'})
export class AddClassSessionService {
  constructor(private readonly scheduleApi: ScheduleApi) {}

  execute(scheduleId: number, request: AddScheduleToWeeklyRequest): Observable<WeeklyScheduleResource> {
    return this.scheduleApi.addClassSession(scheduleId, request);
  }
}
