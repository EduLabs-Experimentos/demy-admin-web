import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ScheduleApi} from '../../infrastructure/schedule-api';
import {CreateWeeklyScheduleRequest} from '../../infrastructure/schedule-request';
import {WeeklyScheduleResource} from '../../infrastructure/schedule-response';

@Injectable({providedIn: 'root'})
export class CreateWeeklyScheduleService {
  constructor(private readonly scheduleApi: ScheduleApi) {}

  execute(request: CreateWeeklyScheduleRequest): Observable<WeeklyScheduleResource> {
    return this.scheduleApi.create(request);
  }
}
