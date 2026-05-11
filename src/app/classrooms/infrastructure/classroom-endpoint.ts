import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {CreateClassroomRequest, UpdateClassroomRequest} from './classroom-request';
import {ClassroomResource, ClassroomResponse} from './classroom-response';
import {environment} from '../../../environments/environment';

export class ClassroomEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderClassroomsEndpointPath}`;
  }

  getAll(): Observable<ClassroomResource[]> {
    return this.http.get<ClassroomResource[]>(this.baseUrl).pipe(
      catchError(this.handleError('Failed to fetch classrooms'))
    );
  }

  getById(classroomId: number): Observable<ClassroomResource> {
    return this.http.get<ClassroomResource>(`${this.baseUrl}/${classroomId}`).pipe(
      catchError(this.handleError('Failed to fetch classroom'))
    );
  }

  create(request: CreateClassroomRequest): Observable<ClassroomResource> {
    return this.http.post<ClassroomResponse>(this.baseUrl, request).pipe(
      map(response => ({ ...response } as ClassroomResource)),
      catchError(this.handleError('Failed to create classroom'))
    );
  }

  update(classroomId: number, request: UpdateClassroomRequest): Observable<ClassroomResource> {
    return this.http.put<ClassroomResponse>(`${this.baseUrl}/${classroomId}`, request).pipe(
      map(response => ({ ...response } as ClassroomResource)),
      catchError(this.handleError('Failed to update classroom'))
    );
  }

  delete(classroomId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${classroomId}`).pipe(
      catchError(this.handleError('Failed to delete classroom'))
    );
  }
}
