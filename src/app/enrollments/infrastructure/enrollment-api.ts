import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnrollmentEndpoint} from './enrollment-endpoint';
import {CreateEnrollmentRequest, UpdateEnrollmentRequest} from './enrollment-request';
import {EnrollmentResource} from './enrollment-response';

@Injectable({providedIn: 'root'})
export class EnrollmentApi {
  private readonly endpoint: EnrollmentEndpoint;

  constructor(http: HttpClient) {
    this.endpoint = new EnrollmentEndpoint(http);
  }

  getAll(): Observable<EnrollmentResource[]> { return this.endpoint.getAll(); }
  getById(id: number): Observable<EnrollmentResource> { return this.endpoint.getById(id); }
  create(request: CreateEnrollmentRequest): Observable<EnrollmentResource> { return this.endpoint.create(request); }
  update(id: number, request: UpdateEnrollmentRequest): Observable<EnrollmentResource> { return this.endpoint.update(id, request); }
  delete(id: number): Observable<void> { return this.endpoint.delete(id); }
}
