import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {CreateCourseRequest, UpdateCourseRequest} from './course-request';
import {CourseResource, CourseResponse} from './course-response';
import {environment} from '../../../environments/environment';

export class CourseEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCoursesEndpointPath}`;
  }

  getAll(): Observable<CourseResource[]> {
    return this.http.get<CourseResource[]>(this.baseUrl).pipe(
      catchError(this.handleError('Failed to fetch courses'))
    );
  }

  getById(courseId: number): Observable<CourseResource> {
    return this.http.get<CourseResource>(`${this.baseUrl}/${courseId}`).pipe(
      catchError(this.handleError('Failed to fetch course'))
    );
  }

  create(request: CreateCourseRequest): Observable<CourseResource> {
    return this.http.post<CourseResponse>(this.baseUrl, request).pipe(
      map(response => ({ ...response } as CourseResource)),
      catchError(this.handleError('Failed to create course'))
    );
  }

  update(courseId: number, request: UpdateCourseRequest): Observable<CourseResource> {
    return this.http.put<CourseResponse>(`${this.baseUrl}/${courseId}`, request).pipe(
      map(response => ({ ...response } as CourseResource)),
      catchError(this.handleError('Failed to update course'))
    );
  }

  delete(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${courseId}`).pipe(
      catchError(this.handleError('Failed to delete course'))
    );
  }
}
