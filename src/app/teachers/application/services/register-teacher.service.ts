import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TeacherApi} from '../../infrastructure/teacher-api';
import {CreateTeacherRequest} from '../../infrastructure/teacher-request';
import {TeacherResource} from '../../infrastructure/teacher-response';

@Injectable({providedIn: 'root'})
export class RegisterTeacherService {
  constructor(private readonly teacherApi: TeacherApi) {}

  execute(teacher: CreateTeacherRequest): Observable<TeacherResource> {
    return this.teacherApi.create(teacher);
  }
}
