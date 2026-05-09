import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CourseApi} from '../../infrastructure/course-api';
import {CourseResource} from '../../infrastructure/course-response';

@Injectable({providedIn: 'root'})
export class GetCourseByIdService {
  constructor(private readonly courseApi: CourseApi) {}

  execute(courseId: number): Observable<CourseResource> {
    return this.courseApi.getById(courseId);
  }
}
