import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ClassroomApi} from '../../infrastructure/classroom-api';

@Injectable({providedIn: 'root'})
export class DeleteClassroomService {
  constructor(private readonly classroomApi: ClassroomApi) {}

  execute(classroomId: number): Observable<void> {
    return this.classroomApi.delete(classroomId);
  }
}
