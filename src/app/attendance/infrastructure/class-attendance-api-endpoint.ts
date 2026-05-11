import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { ClassAttendance, AttendanceStatus } from '../domain/model/class-attendance.entity';
import { ClassAttendanceResource, ClassAttendancesResponse } from './class-attendance-response';
import { ClassAttendanceAssembler } from './class-attendance-assembler';
import { environment } from '../../../environments/environment';

export class ClassAttendanceApiEndpoint
  extends BaseApiEndpoint<ClassAttendance, ClassAttendanceResource, ClassAttendancesResponse, ClassAttendanceAssembler> {

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderClassAttendancesEndpointPath}`,
      new ClassAttendanceAssembler()
    );
  }

  getAllByAcademy(): Observable<ClassAttendance[]> {
    return this.http.get<ClassAttendanceResource[]>(`${this.endpointUrl}/all`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch attendances'))
    );
  }

  patchStatus(id: number, dni: string, status: AttendanceStatus): Observable<ClassAttendance> {
    return this.http.patch<ClassAttendanceResource>(
      `${this.endpointUrl}/${id}/attendance/${dni}/status`,
      { status }
    ).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to update attendance status'))
    );
  }
}
