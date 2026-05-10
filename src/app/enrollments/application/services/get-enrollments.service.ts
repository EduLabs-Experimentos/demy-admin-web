import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EnrollmentApi} from '../../infrastructure/enrollment-api';
import {EnrollmentResource} from '../../infrastructure/enrollment-response';

@Injectable({providedIn: 'root'})
export class GetEnrollmentsService {
  constructor(private readonly api: EnrollmentApi) {}
  execute(): Observable<EnrollmentResource[]> { return this.api.getAll(); }
}
