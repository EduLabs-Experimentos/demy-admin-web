import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EnrollmentApi} from '../../infrastructure/enrollment-api';

@Injectable({providedIn: 'root'})
export class DeleteEnrollmentService {
  constructor(private readonly api: EnrollmentApi) {}
  execute(id: number): Observable<void> { return this.api.delete(id); }
}
