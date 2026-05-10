import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EnrollmentApi} from '../../infrastructure/enrollment-api';
import {EnrollmentResource} from '../../infrastructure/enrollment-response';

@Injectable({providedIn: 'root'})
export class CreateEnrollmentService {
  constructor(private readonly api: EnrollmentApi) {}
  execute(request: any): Observable<EnrollmentResource> { return this.api.create(request); }
}
