import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AcademicPeriodApi} from '../../infrastructure/academic-period-api';

@Injectable({providedIn: 'root'})
export class DeleteAcademicPeriodService {
  constructor(private readonly api: AcademicPeriodApi) {}
  execute(periodId: number): Observable<void> { return this.api.delete(periodId); }
}
