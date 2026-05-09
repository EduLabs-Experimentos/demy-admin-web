import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ClassroomApi} from '../../infrastructure/classroom-api';
import {ClassroomResource} from '../../infrastructure/classroom-response';

@Injectable({providedIn: 'root'})
export class GetClassroomByIdService {
  constructor(private readonly classroomApi: ClassroomApi) {}

  execute(classroomId: number): Observable<ClassroomResource> {
    return this.classroomApi.getById(classroomId);
  }
}
