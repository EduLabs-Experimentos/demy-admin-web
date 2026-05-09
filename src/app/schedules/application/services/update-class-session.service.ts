import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ScheduleApi} from '../../infrastructure/schedule-api';
import {UpdateScheduleRequest} from '../../infrastructure/schedule-request';
import {ScheduleResource} from '../../infrastructure/schedule-response';

@Injectable({providedIn: 'root'})
export class UpdateClassSessionService {
  constructor(private readonly scheduleApi: ScheduleApi) {}

  execute(classSessionId: number, request: UpdateScheduleRequest): Observable<ScheduleResource> {
    return this.scheduleApi.updateClassSession(classSessionId, request);
  }
}
