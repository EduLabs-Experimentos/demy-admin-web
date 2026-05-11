import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ScheduleApi} from '../../infrastructure/schedule-api';
import {WeeklyScheduleResource} from '../../infrastructure/schedule-response';

@Injectable({providedIn: 'root'})
export class GetWeeklyScheduleByIdService {
  constructor(private readonly scheduleApi: ScheduleApi) {}

  execute(scheduleId: number): Observable<WeeklyScheduleResource> {
    return this.scheduleApi.getById(scheduleId);
  }
}
