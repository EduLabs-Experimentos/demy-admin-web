import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {EnrollmentPeriodReference, EnrollmentScheduleReference} from './enrollment-response';

export class EnrollmentReferenceEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly periodsUrl: string;
  private readonly schedulesUrl: string;

  constructor(private http: HttpClient) {
    super();
    this.periodsUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAcademicPeriodsEndpointPath}`;
    this.schedulesUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSchedulesEndpointPath}`;
  }

  getPeriods(): Observable<EnrollmentPeriodReference[]> {
    return this.http.get<EnrollmentPeriodReference[]>(this.periodsUrl).pipe(
      catchError(this.handleError('Failed to fetch periods'))
    );
  }

  getSchedules(): Observable<EnrollmentScheduleReference[]> {
    return this.http.get<EnrollmentScheduleReference[]>(this.schedulesUrl).pipe(
      catchError(this.handleError('Failed to fetch schedules'))
    );
  }
}
