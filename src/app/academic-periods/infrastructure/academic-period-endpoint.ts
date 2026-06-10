import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {CreateAcademicPeriodRequest, UpdateAcademicPeriodRequest} from './academic-period-request';
import {AcademicPeriodResource, AcademicPeriodResponse} from './academic-period-response';
import {environment} from '../../../environments/environment';

export class AcademicPeriodEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAcademicPeriodsEndpointPath}`;
  }

  getAll(): Observable<AcademicPeriodResource[]> {
    return this.http.get<AcademicPeriodResource[]>(this.baseUrl).pipe(
      catchError(() => of([]))
    );
  }

  getById(periodId: number): Observable<AcademicPeriodResource> {
    return this.http.get<AcademicPeriodResource>(`${this.baseUrl}/${periodId}`).pipe(
      catchError(this.handleError('Failed to fetch academic period'))
    );
  }

  create(request: CreateAcademicPeriodRequest): Observable<AcademicPeriodResource> {
    return this.http.post<AcademicPeriodResponse>(this.baseUrl, request).pipe(
      map(response => ({ ...response } as AcademicPeriodResource)),
      catchError(this.handleError('Failed to create academic period'))
    );
  }

  update(periodId: number, request: UpdateAcademicPeriodRequest): Observable<AcademicPeriodResource> {
    return this.http.put<AcademicPeriodResponse>(`${this.baseUrl}/${periodId}`, request).pipe(
      map(response => ({ ...response } as AcademicPeriodResource)),
      catchError(this.handleError('Failed to update academic period'))
    );
  }

  delete(periodId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${periodId}`).pipe(
      catchError(this.handleError('Failed to delete academic period'))
    );
  }
}
