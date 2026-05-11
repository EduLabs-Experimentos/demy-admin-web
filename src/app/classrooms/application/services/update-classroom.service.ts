import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ClassroomApi} from '../../infrastructure/classroom-api';
import {UpdateClassroomRequest} from '../../infrastructure/classroom-request';
import {ClassroomResource} from '../../infrastructure/classroom-response';

@Injectable({providedIn: 'root'})
export class UpdateClassroomService {
  constructor(private readonly classroomApi: ClassroomApi) {}

  execute(classroomId: number, request: UpdateClassroomRequest): Observable<ClassroomResource> {
    return this.classroomApi.update(classroomId, request);
  }
}
