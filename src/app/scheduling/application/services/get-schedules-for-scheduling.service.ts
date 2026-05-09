import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ScheduleApi} from '../../../schedules/infrastructure/schedule-api';
import {Schedule} from '../../../schedules/domain/model/schedule.entity';

@Injectable({providedIn: 'root'})
export class GetSchedulesForSchedulingService {
  constructor(private readonly scheduleApi: ScheduleApi) {}

  execute(): Observable<Schedule[]> {
    return this.scheduleApi.getAll();
  }
}
