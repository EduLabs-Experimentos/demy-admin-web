import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TeacherApi} from '../../infrastructure/teacher-api';
import {TeacherResource} from '../../infrastructure/teacher-response';

@Injectable({providedIn: 'root'})
export class GetTeachersService {
  constructor(private readonly teacherApi: TeacherApi) {}

  execute(): Observable<TeacherResource[]> {
    return this.teacherApi.getAll();
  }
}
