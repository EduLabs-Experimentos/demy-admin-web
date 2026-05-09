import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ScheduleApi} from '../../infrastructure/schedule-api';
import {WeeklyScheduleResource} from '../../infrastructure/schedule-response';

@Injectable({providedIn: 'root'})
export class RemoveClassSessionService {
  constructor(private readonly scheduleApi: ScheduleApi) {}

  execute(scheduleId: number, classSessionId: number): Observable<WeeklyScheduleResource> {
    return this.scheduleApi.removeClassSession(scheduleId, classSessionId);
  }
}
