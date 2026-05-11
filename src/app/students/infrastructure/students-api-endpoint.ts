import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Student } from '../domain/model/student.entity';
import { StudentResource, StudentsResponse } from './students-response';
import { StudentAssembler } from './student-assembler';
import { environment } from '../../../environments/environment';

export class StudentsApiEndpoint extends BaseApiEndpoint<Student, StudentResource, StudentsResponse, StudentAssembler> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderStudentsEndpointPath}`,
      new StudentAssembler()
    );
  }
}
