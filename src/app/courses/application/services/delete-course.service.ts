import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CourseApi} from '../../infrastructure/course-api';

@Injectable({providedIn: 'root'})
export class DeleteCourseService {
  constructor(private readonly courseApi: CourseApi) {}

  execute(courseId: number): Observable<void> {
    return this.courseApi.delete(courseId);
  }
}
