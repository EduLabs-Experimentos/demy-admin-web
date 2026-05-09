import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CourseApi} from '../../infrastructure/course-api';
import {CourseResource} from '../../infrastructure/course-response';

@Injectable({providedIn: 'root'})
export class GetCoursesService {
  constructor(private readonly courseApi: CourseApi) {}

  execute(): Observable<CourseResource[]> {
    return this.courseApi.getAll();
  }
}
