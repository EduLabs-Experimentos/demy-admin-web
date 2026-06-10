import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {CreateEnrollmentRequest, UpdateEnrollmentRequest} from './enrollment-request';
import {EnrollmentResource, EnrollmentResponse} from './enrollment-response';
import {environment} from '../../../environments/environment';

export class EnrollmentEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderEnrollmentsEndpointPath}`;
  }

  getAll(): Observable<EnrollmentResource[]> {
    return this.http.get<EnrollmentResource[]>(this.baseUrl).pipe(
      catchError(() => of([]))
    );
  }

  getById(enrollmentId: number): Observable<EnrollmentResource> {
    return this.http.get<EnrollmentResource>(`${this.baseUrl}/${enrollmentId}`).pipe(
      catchError(this.handleError('Failed to fetch enrollment'))
    );
  }

  create(request: CreateEnrollmentRequest): Observable<EnrollmentResource> {
    return this.http.post<EnrollmentResponse>(this.baseUrl, request).pipe(
      map(response => ({ ...response } as EnrollmentResource)),
      catchError(this.handleError('Failed to create enrollment'))
    );
  }

  update(enrollmentId: number, request: UpdateEnrollmentRequest): Observable<EnrollmentResource> {
    return this.http.put<EnrollmentResponse>(`${this.baseUrl}/${enrollmentId}`, request).pipe(
      map(response => ({ ...response } as EnrollmentResource)),
      catchError(this.handleError('Failed to update enrollment'))
    );
  }

  delete(enrollmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${enrollmentId}`).pipe(
      catchError(this.handleError('Failed to delete enrollment'))
    );
  }
}
