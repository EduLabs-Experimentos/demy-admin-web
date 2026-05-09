import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CourseApi} from '../../infrastructure/course-api';
import {UpdateCourseRequest} from '../../infrastructure/course-request';
import {CourseResource} from '../../infrastructure/course-response';

@Injectable({providedIn: 'root'})
export class UpdateCourseService {
  constructor(private readonly courseApi: CourseApi) {}

  execute(courseId: number, request: UpdateCourseRequest): Observable<CourseResource> {
    return this.courseApi.update(courseId, request);
  }
}
