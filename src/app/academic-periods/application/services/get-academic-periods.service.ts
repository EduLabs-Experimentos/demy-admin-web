import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AcademicPeriodApi} from '../../infrastructure/academic-period-api';
import {AcademicPeriodResource} from '../../infrastructure/academic-period-response';

@Injectable({providedIn: 'root'})
export class GetAcademicPeriodsService {
  constructor(private readonly api: AcademicPeriodApi) {}
  execute(): Observable<AcademicPeriodResource[]> { return this.api.getAll(); }
}
