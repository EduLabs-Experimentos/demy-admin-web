import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CourseApi} from '../../infrastructure/course-api';
import {CreateCourseRequest} from '../../infrastructure/course-request';
import {CourseResource} from '../../infrastructure/course-response';

@Injectable({providedIn: 'root'})
export class CreateCourseService {
  constructor(private readonly courseApi: CourseApi) {}

  execute(request: CreateCourseRequest): Observable<CourseResource> {
    return this.courseApi.create(request);
  }
}
