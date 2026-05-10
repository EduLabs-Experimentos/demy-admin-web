import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnrollmentReferenceEndpoint} from './enrollment-reference-endpoint';
import {EnrollmentPeriodReference, EnrollmentScheduleReference} from './enrollment-response';

@Injectable({providedIn: 'root'})
export class EnrollmentReferenceApi {
  private readonly endpoint: EnrollmentReferenceEndpoint;

  constructor(http: HttpClient) { this.endpoint = new EnrollmentReferenceEndpoint(http); }

  getPeriods(): Observable<EnrollmentPeriodReference[]> { return this.endpoint.getPeriods(); }
  getSchedules(): Observable<EnrollmentScheduleReference[]> { return this.endpoint.getSchedules(); }
}
