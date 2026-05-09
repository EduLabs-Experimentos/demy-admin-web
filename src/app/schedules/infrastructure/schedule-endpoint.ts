import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {CreateWeeklyScheduleRequest, UpdateWeeklyScheduleNameRequest, AddScheduleToWeeklyRequest, UpdateScheduleRequest} from './schedule-request';
import {WeeklyScheduleResource, WeeklyScheduleResponse, ScheduleResource, ScheduleResponse} from './schedule-response';
import {environment} from '../../../environments/environment.development';

export class ScheduleEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSchedulesEndpointPath}`;
  }

  getAll(): Observable<WeeklyScheduleResource[]> {
    return this.http.get<WeeklyScheduleResource[]>(this.baseUrl).pipe(
      catchError(this.handleError('Failed to fetch schedules'))
    );
  }

  getById(scheduleId: number): Observable<WeeklyScheduleResource> {
    return this.http.get<WeeklyScheduleResource>(`${this.baseUrl}/${scheduleId}`).pipe(
      catchError(this.handleError('Failed to fetch schedule'))
    );
  }

  create(request: CreateWeeklyScheduleRequest): Observable<WeeklyScheduleResource> {
    return this.http.post<WeeklyScheduleResponse>(this.baseUrl, request).pipe(
      map(response => ({ ...response } as WeeklyScheduleResource)),
      catchError(this.handleError('Failed to create schedule'))
    );
  }

  update(scheduleId: number, request: UpdateWeeklyScheduleNameRequest): Observable<WeeklyScheduleResource> {
    return this.http.put<WeeklyScheduleResponse>(`${this.baseUrl}/${scheduleId}`, request).pipe(
      map(response => ({ ...response } as WeeklyScheduleResource)),
      catchError(this.handleError('Failed to update schedule'))
    );
  }

  delete(scheduleId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${scheduleId}`).pipe(
      catchError(this.handleError('Failed to delete schedule'))
    );
  }

  addClassSession(scheduleId: number, request: AddScheduleToWeeklyRequest): Observable<WeeklyScheduleResource> {
    return this.http.post<WeeklyScheduleResponse>(`${this.baseUrl}/${scheduleId}/class-sessions`, request).pipe(
      map(response => ({ ...response } as WeeklyScheduleResource)),
      catchError(this.handleError('Failed to add class session'))
    );
  }

  removeClassSession(scheduleId: number, classSessionId: number): Observable<WeeklyScheduleResource> {
    return this.http.delete<WeeklyScheduleResponse>(`${this.baseUrl}/${scheduleId}/class-sessions/${classSessionId}`).pipe(
      map(response => ({ ...response } as WeeklyScheduleResource)),
      catchError(this.handleError('Failed to remove class session'))
    );
  }

  updateClassSession(classSessionId: number, request: UpdateScheduleRequest): Observable<ScheduleResource> {
    return this.http.put<ScheduleResponse>(`${this.baseUrl}/class-sessions/${classSessionId}`, request).pipe(
      map(response => ({ ...response } as ScheduleResource)),
      catchError(this.handleError('Failed to update class session'))
    );
  }
}
