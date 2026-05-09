import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ScheduleApi} from '../../infrastructure/schedule-api';
import {WeeklyScheduleResource} from '../../infrastructure/schedule-response';

@Injectable({providedIn: 'root'})
export class GetWeeklySchedulesService {
  constructor(private readonly scheduleApi: ScheduleApi) {}

  execute(): Observable<WeeklyScheduleResource[]> {
    return this.scheduleApi.getAll();
  }
}
