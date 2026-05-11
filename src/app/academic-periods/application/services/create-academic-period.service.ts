import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AcademicPeriodApi} from '../../infrastructure/academic-period-api';
import {CreateAcademicPeriodRequest} from '../../infrastructure/academic-period-request';
import {AcademicPeriodResource} from '../../infrastructure/academic-period-response';

@Injectable({providedIn: 'root'})
export class CreateAcademicPeriodService {
  constructor(private readonly api: AcademicPeriodApi) {}
  execute(request: CreateAcademicPeriodRequest): Observable<AcademicPeriodResource> { return this.api.create(request); }
}
