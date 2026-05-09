import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ClassroomApi} from '../../infrastructure/classroom-api';
import {CreateClassroomRequest} from '../../infrastructure/classroom-request';
import {ClassroomResource} from '../../infrastructure/classroom-response';

@Injectable({providedIn: 'root'})
export class CreateClassroomService {
  constructor(private readonly classroomApi: ClassroomApi) {}

  execute(request: CreateClassroomRequest): Observable<ClassroomResource> {
    return this.classroomApi.create(request);
  }
}
