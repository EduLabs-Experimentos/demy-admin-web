import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AcademicPeriodApi} from '../../infrastructure/academic-period-api';
import {UpdateAcademicPeriodRequest} from '../../infrastructure/academic-period-request';
import {AcademicPeriodResource} from '../../infrastructure/academic-period-response';

@Injectable({providedIn: 'root'})
export class UpdateAcademicPeriodService {
  constructor(private readonly api: AcademicPeriodApi) {}
  execute(periodId: number, request: UpdateAcademicPeriodRequest): Observable<AcademicPeriodResource> { return this.api.update(periodId, request); }
}
