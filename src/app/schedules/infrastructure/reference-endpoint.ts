import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ScheduleCourseResource, ScheduleClassroomResource, ScheduleTeacherResource} from './schedule-response';

export class ReferenceEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly coursesUrl: string;
  private readonly classroomsUrl: string;
  private readonly teachersUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.coursesUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCoursesEndpointPath}`;
    this.classroomsUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderClassroomsEndpointPath}`;
    this.teachersUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTeachersEndpointPath}`;
  }

  getCourses(): Observable<ScheduleCourseResource[]> {
    return this.http.get<ScheduleCourseResource[]>(this.coursesUrl).pipe(
      catchError(this.handleError('Failed to fetch courses'))
    );
  }

  getClassrooms(): Observable<ScheduleClassroomResource[]> {
    return this.http.get<ScheduleClassroomResource[]>(this.classroomsUrl).pipe(
      catchError(this.handleError('Failed to fetch classrooms'))
    );
  }

  getTeachers(): Observable<ScheduleTeacherResource[]> {
    return this.http.get<ScheduleTeacherResource[]>(this.teachersUrl).pipe(
      catchError(this.handleError('Failed to fetch teachers'))
    );
  }
}
