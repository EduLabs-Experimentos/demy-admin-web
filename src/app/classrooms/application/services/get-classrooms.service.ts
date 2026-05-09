import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ClassroomApi} from '../../infrastructure/classroom-api';
import {ClassroomResource} from '../../infrastructure/classroom-response';

@Injectable({providedIn: 'root'})
export class GetClassroomsService {
  constructor(private readonly classroomApi: ClassroomApi) {}

  execute(): Observable<ClassroomResource[]> {
    return this.classroomApi.getAll();
  }
}
