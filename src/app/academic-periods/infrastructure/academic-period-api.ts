import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AcademicPeriodEndpoint} from './academic-period-endpoint';
import {CreateAcademicPeriodRequest, UpdateAcademicPeriodRequest} from './academic-period-request';
import {AcademicPeriodResource} from './academic-period-response';

@Injectable({providedIn: 'root'})
export class AcademicPeriodApi {
  private readonly endpoint: AcademicPeriodEndpoint;

  constructor(http: HttpClient) {
    this.endpoint = new AcademicPeriodEndpoint(http);
  }

  getAll(): Observable<AcademicPeriodResource[]> {
    return this.endpoint.getAll();
  }

  getById(periodId: number): Observable<AcademicPeriodResource> {
    return this.endpoint.getById(periodId);
  }

  create(request: CreateAcademicPeriodRequest): Observable<AcademicPeriodResource> {
    return this.endpoint.create(request);
  }

  update(periodId: number, request: UpdateAcademicPeriodRequest): Observable<AcademicPeriodResource> {
    return this.endpoint.update(periodId, request);
  }

  delete(periodId: number): Observable<void> {
    return this.endpoint.delete(periodId);
  }
}
