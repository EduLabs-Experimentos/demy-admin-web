import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ScheduleApi} from '../../infrastructure/schedule-api';

@Injectable({providedIn: 'root'})
export class DeleteWeeklyScheduleService {
  constructor(private readonly scheduleApi: ScheduleApi) {}

  execute(scheduleId: number): Observable<void> {
    return this.scheduleApi.delete(scheduleId);
  }
}
