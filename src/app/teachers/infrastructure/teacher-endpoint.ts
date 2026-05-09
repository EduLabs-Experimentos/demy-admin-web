import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {CreateTeacherRequest} from './teacher-request';
import {TeacherResource, TeacherResponse} from './teacher-response';
import {environment} from '../../../environments/environment.development';

export class TeacherEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTeachersEndpointPath}`;
  }

  getAll(): Observable<TeacherResource[]> {
    return this.http.get<TeacherResource[]>(this.baseUrl).pipe(
      catchError(this.handleError('Failed to fetch teachers'))
    );
  }

  create(request: CreateTeacherRequest): Observable<TeacherResource> {
    return this.http.post<TeacherResponse>(this.baseUrl, request).pipe(
      map(response => ({ ...response } as TeacherResource)),
      catchError(this.handleError('Failed to register teacher'))
    );
  }
}
